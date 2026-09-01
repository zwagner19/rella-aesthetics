import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ATTRIBUTION_REVOCATION_RETRY_DELAYS_MS,
  createAttributionRevocationRetry,
  type AttributionRevocationRetryState,
} from "./attribution-revocation-retry";
import { ATTRIBUTION_REVOCATION_TIMEOUT_MS } from "./attribution-capture-request";
import { createAttributionRequestQueue } from "./attribution-request-queue";

async function flushPromises() {
  for (let index = 0; index < 30; index += 1) {
    await Promise.resolve();
  }
}

describe("bounded attribution revocation retry", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("recovers from a transient 5xx while the page is visible and online", async () => {
    vi.useFakeTimers();
    const state: AttributionRevocationRetryState = {
      active: true,
      consentState: "denied",
      generation: 1,
      online: true,
      visible: true,
    };
    const statuses = [500, 200];
    const revoke = vi.fn(async () => statuses.shift() === 200);
    const onAcknowledged = vi.fn();
    const retry = createAttributionRevocationRetry({
      getState: () => state,
      revoke,
      onAcknowledged,
    });

    retry.require({ resetBackoff: true });
    retry.retryNow();
    await flushPromises();
    expect(revoke).toHaveBeenCalledOnce();
    expect(retry.isRequired()).toBe(true);

    await vi.advanceTimersByTimeAsync(
      ATTRIBUTION_REVOCATION_RETRY_DELAYS_MS[0],
    );
    expect(revoke).toHaveBeenCalledTimes(2);
    expect(onAcknowledged).toHaveBeenCalledOnce();
    expect(retry.isAcknowledged()).toBe(true);
    expect(retry.isRequired()).toBe(false);
  });

  it("times out an abort-ignored revoke and releases the queue for retry", async () => {
    vi.useFakeTimers();
    const state: AttributionRevocationRetryState = {
      active: true,
      consentState: "denied",
      generation: 5,
      online: true,
      visible: true,
    };
    const queue = createAttributionRequestQueue();
    const signals: AbortSignal[] = [];
    const revoke = vi.fn((signal: AbortSignal) => {
      signals.push(signal);
      if (signals.length === 1) {
        return new Promise<boolean>(() => undefined);
      }
      return Promise.resolve(true);
    });
    const onAcknowledged = vi.fn();
    const retry = createAttributionRevocationRetry({
      getState: () => state,
      enqueue: (request) => queue.enqueue(request),
      revoke,
      onAcknowledged,
    });

    retry.require({ resetBackoff: true });
    retry.retryNow();
    await flushPromises();
    expect(retry.isInFlight()).toBe(true);
    expect(signals[0]?.aborted).toBe(false);

    await vi.advanceTimersByTimeAsync(ATTRIBUTION_REVOCATION_TIMEOUT_MS);
    expect(signals[0]?.aborted).toBe(true);
    expect(retry.isInFlight()).toBe(false);
    expect(retry.isRequired()).toBe(true);

    await vi.advanceTimersByTimeAsync(
      ATTRIBUTION_REVOCATION_RETRY_DELAYS_MS[0],
    );
    expect(revoke).toHaveBeenCalledTimes(2);
    expect(onAcknowledged).toHaveBeenCalledOnce();
    expect(retry.isRequired()).toBe(false);
  });

  it("aborts a hung revoke and removes all timers on cleanup", async () => {
    vi.useFakeTimers();
    const state: AttributionRevocationRetryState = {
      active: true,
      consentState: "denied",
      generation: 6,
      online: true,
      visible: true,
    };
    let signal: AbortSignal | undefined;
    const retry = createAttributionRevocationRetry({
      getState: () => state,
      revoke: (nextSignal) => {
        signal = nextSignal;
        return new Promise<boolean>(() => undefined);
      },
      onAcknowledged: vi.fn(),
    });

    retry.require({ resetBackoff: true });
    retry.retryNow();
    await flushPromises();
    expect(signal?.aborted).toBe(false);
    retry.dispose();
    await flushPromises();

    expect(signal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("rejects a terminal response from an older denial generation", async () => {
    vi.useFakeTimers();
    const state: AttributionRevocationRetryState = {
      active: true,
      consentState: "denied",
      generation: 7,
      online: true,
      visible: true,
    };
    let resolveFirst: ((value: boolean) => void) | undefined;
    const revoke = vi.fn(() => new Promise<boolean>((resolve) => {
      resolveFirst = resolve;
    }));
    const onAcknowledged = vi.fn();
    const retry = createAttributionRevocationRetry({
      getState: () => state,
      revoke,
      onAcknowledged,
    });

    retry.require({ resetBackoff: true });
    retry.retryNow();
    await flushPromises();
    retry.require({ resetBackoff: true });
    resolveFirst?.(true);
    await flushPromises();

    expect(onAcknowledged).not.toHaveBeenCalled();
    expect(retry.isRequired()).toBe(true);
    expect(vi.getTimerCount()).toBe(1);
    retry.dispose();
  });

  it("does not mutate a shared handle after a terminal acknowledgement", async () => {
    vi.useFakeTimers();
    const state: AttributionRevocationRetryState = {
      active: true,
      consentState: "denied",
      generation: 8,
      online: true,
      visible: true,
    };
    const firstHandle = `rvh_${"1".repeat(43)}`;
    const secondHandle = `rvh_${"2".repeat(43)}`;
    let currentHandle: string | null = firstHandle;
    let resolveFirst: ((value: boolean) => void) | undefined;
    const attemptedHandles: Array<string | null> = [];
    const revoke = vi.fn((
      _signal: AbortSignal,
      attemptedHandle: string | null,
    ) => {
      attemptedHandles.push(attemptedHandle);
      if (attemptedHandles.length === 1) {
        return new Promise<boolean>((resolve) => {
          resolveFirst = resolve;
        });
      }
      return Promise.resolve(true);
    });
    const onAcknowledged = vi.fn();
    const retry = createAttributionRevocationRetry({
      getState: () => state,
      getRevocationHandle: () => currentHandle,
      revoke,
      onAcknowledged,
    });

    retry.require({ resetBackoff: true });
    retry.retryNow();
    await flushPromises();
    currentHandle = secondHandle;
    resolveFirst?.(true);
    await flushPromises();

    expect(attemptedHandles).toEqual([firstHandle]);
    expect(currentHandle).toBe(secondHandle);
    expect(onAcknowledged).toHaveBeenCalledOnce();
    expect(retry.isRequired()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("stops after the finite exponential retry budget", async () => {
    vi.useFakeTimers();
    const state: AttributionRevocationRetryState = {
      active: true,
      consentState: "denied",
      generation: 2,
      online: true,
      visible: true,
    };
    const revoke = vi.fn(async () => false);
    const retry = createAttributionRevocationRetry({
      getState: () => state,
      revoke,
      onAcknowledged: vi.fn(),
    });

    retry.require({ resetBackoff: true });
    retry.retryNow();
    await flushPromises();
    for (const delay of ATTRIBUTION_REVOCATION_RETRY_DELAYS_MS) {
      await vi.advanceTimersByTimeAsync(delay);
    }
    await vi.runAllTimersAsync();

    expect(revoke).toHaveBeenCalledTimes(
      1 + ATTRIBUTION_REVOCATION_RETRY_DELAYS_MS.length,
    );
    expect(retry.isRequired()).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cancels retry work on cleanup and ignores a stale generation", async () => {
    vi.useFakeTimers();
    const state: AttributionRevocationRetryState = {
      active: true,
      consentState: "denied",
      generation: 3,
      online: true,
      visible: true,
    };
    const revoke = vi.fn(async () => false);
    const retry = createAttributionRevocationRetry({
      getState: () => state,
      revoke,
      onAcknowledged: vi.fn(),
    });

    retry.require({ resetBackoff: true });
    retry.retryNow();
    await flushPromises();
    state.generation += 1;
    await vi.advanceTimersByTimeAsync(
      ATTRIBUTION_REVOCATION_RETRY_DELAYS_MS[0],
    );
    expect(revoke).toHaveBeenCalledOnce();

    retry.retryNow();
    await flushPromises();
    expect(revoke).toHaveBeenCalledTimes(2);
    retry.dispose();
    await vi.runAllTimersAsync();
    expect(revoke).toHaveBeenCalledTimes(2);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not arm automatic retries while hidden, offline, or unknown", async () => {
    vi.useFakeTimers();
    const state: AttributionRevocationRetryState = {
      active: true,
      consentState: "denied",
      generation: 4,
      online: false,
      visible: true,
    };
    const revoke = vi.fn(async () => false);
    const retry = createAttributionRevocationRetry({
      getState: () => state,
      revoke,
      onAcknowledged: vi.fn(),
    });

    retry.require({ resetBackoff: true });
    retry.retryNow();
    await flushPromises();
    expect(revoke).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);

    state.online = true;
    state.visible = false;
    retry.retryNow();
    await flushPromises();
    expect(revoke).toHaveBeenCalledTimes(2);
    expect(vi.getTimerCount()).toBe(0);

    state.visible = true;
    state.consentState = "unknown";
    retry.retryNow();
    await flushPromises();
    expect(revoke).toHaveBeenCalledTimes(2);
  });
});
