export interface AttributionRequestQueue {
  enqueue<T>(request: () => Promise<T>): Promise<T>;
}

/** Serialize capture and revocation so a stale grant cannot finish after deny. */
export function createAttributionRequestQueue(): AttributionRequestQueue {
  let tail: Promise<unknown> = Promise.resolve();
  return {
    enqueue<T>(request: () => Promise<T>): Promise<T> {
      const result = tail.then(request, request);
      tail = result.then(
        () => undefined,
        () => undefined,
      );
      return result;
    },
  };
}
