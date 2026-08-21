import type { AttributionConsentState } from "./attribution-consent";
import {
  ATTRIBUTION_REVOCATION_TIMEOUT_MS,
  createAbortableAttributionRequest,
  type AbortableAttributionRequest,
} from "./attribution-capture-request";

export const ATTRIBUTION_REVOCATION_RETRY_DELAYS_MS = [
  1_000,
  2_000,
  4_000,
  8_000,
] as const;

export interface AttributionRevocationRetryState {
  active: boolean;
  consentState: AttributionConsentState;
  generation: number;
  online: boolean;
  visible: boolean;
}

export interface AttributionRevocationRetry {
  require(options?: { resetBackoff?: boolean }): void;
  retryNow(): void;
  pause(): void;
  dispose(): void;
  isAcknowledged(): boolean;
  isInFlight(): boolean;
  isRequired(): boolean;
}

/**
 * Retry a click-identifier-free denial with a finite exponential backoff.
 * External lifecycle triggers may request an immediate attempt without
 * resetting the automatic retry budget for the current denial generation.
 */
export function createAttributionRevocationRetry(args: {
  getState(): AttributionRevocationRetryState;
  getRevocationHandle?(): string | null;
  enqueue?(request: () => Promise<boolean>): Promise<boolean>;
  revoke(
    signal: AbortSignal,
    revocationHandle: string | null,
  ): Promise<boolean>;
  onAcknowledged(): void;
}): AttributionRevocationRetry {
  let acknowledged = false;
  let disposed = false;
  let inFlight = false;
  let required = false;
  let requirementGeneration = 0;
  let revokeAttempt: AbortableAttributionRequest | null = null;
  let retryIndex = 0;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  function clearRetryTimer() {
    if (retryTimer === null) return;
    clearTimeout(retryTimer);
    retryTimer = null;
  }

  function canRequest() {
    const state = args.getState();
    return state.active && state.consentState !== "unknown";
  }

  function scheduleRetry() {
    if (
      disposed ||
      !required ||
      retryTimer !== null ||
      retryIndex >= ATTRIBUTION_REVOCATION_RETRY_DELAYS_MS.length
    ) {
      return;
    }
    const state = args.getState();
    if (
      !state.active ||
      state.consentState === "unknown" ||
      !state.online ||
      !state.visible
    ) {
      return;
    }

    const expectedGeneration = state.generation;
    const delay = ATTRIBUTION_REVOCATION_RETRY_DELAYS_MS[retryIndex];
    retryIndex += 1;
    retryTimer = setTimeout(() => {
      retryTimer = null;
      const current = args.getState();
      if (
        disposed ||
        !required ||
        !current.active ||
        current.consentState === "unknown" ||
        !current.online ||
        !current.visible ||
        current.generation !== expectedGeneration
      ) {
        return;
      }
      retryNow();
    }, delay);
  }

  function retryNow() {
    if (disposed || !required || inFlight || !canRequest()) return;
    clearRetryTimer();
    inFlight = true;
    const requestGeneration = requirementGeneration;
    let attemptedHandle: string | null = null;
    const enqueue = args.enqueue ?? ((request) => request());
    void enqueue(() => {
      if (disposed || !required || !canRequest()) return Promise.resolve(false);
      attemptedHandle = args.getRevocationHandle?.() ?? null;
      const attempt = createAbortableAttributionRequest(
        (signal) => args.revoke(signal, attemptedHandle),
        ATTRIBUTION_REVOCATION_TIMEOUT_MS,
      );
      revokeAttempt = attempt;
      return attempt.promise.finally(() => {
        if (revokeAttempt === attempt) revokeAttempt = null;
      });
    })
      .catch(() => false)
      .then((serverAcknowledged) => {
        inFlight = false;
        if (disposed || !required) return;
        if (
          !serverAcknowledged ||
          requestGeneration !== requirementGeneration
        ) {
          scheduleRetry();
          return;
        }
        acknowledged = true;
        required = false;
        retryIndex = 0;
        clearRetryTimer();
        args.onAcknowledged();
      });
  }

  return {
    require(options) {
      required = true;
      acknowledged = false;
      if (options?.resetBackoff) {
        requirementGeneration += 1;
        retryIndex = 0;
        clearRetryTimer();
        revokeAttempt?.abort();
      }
    },
    retryNow,
    pause() {
      clearRetryTimer();
      revokeAttempt?.abort();
    },
    dispose() {
      disposed = true;
      clearRetryTimer();
      revokeAttempt?.abort();
    },
    isAcknowledged: () => acknowledged,
    isInFlight: () => inFlight,
    isRequired: () => required,
  };
}
