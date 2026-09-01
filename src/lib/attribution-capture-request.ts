export const ATTRIBUTION_CAPTURE_TIMEOUT_MS = 10_000;
export const ATTRIBUTION_REVOCATION_TIMEOUT_MS = 10_000;

export interface AbortableAttributionRequest {
  promise: Promise<boolean>;
  abort(): void;
}

export type AbortableAttributionCapture = AbortableAttributionRequest;

/**
 * Bound a capture request even when a fetch implementation ignores abort.
 * This lets a later denial reach the serialized revocation request promptly.
 */
export function createAbortableAttributionRequest(
  request: (signal: AbortSignal) => Promise<boolean>,
  timeoutMs: number,
): AbortableAttributionRequest {
  const controller = new AbortController();
  let interrupted = false;
  let settled = false;
  let resolveInterruption: (() => void) | undefined;

  const interruption = new Promise<boolean>((resolve) => {
    resolveInterruption = () => resolve(false);
  });
  const requestResult = Promise.resolve()
    .then(() => interrupted ? false : request(controller.signal))
    .catch(() => false);

  function abort() {
    if (settled || interrupted) return;
    interrupted = true;
    controller.abort();
    resolveInterruption?.();
  }

  const timeout = setTimeout(abort, timeoutMs);
  const promise = Promise.race([requestResult, interruption]).finally(() => {
    settled = true;
    clearTimeout(timeout);
  });

  return { promise, abort };
}

export function createAbortableAttributionCapture(
  request: (signal: AbortSignal) => Promise<boolean>,
  timeoutMs = ATTRIBUTION_CAPTURE_TIMEOUT_MS,
): AbortableAttributionCapture {
  return createAbortableAttributionRequest(request, timeoutMs);
}
