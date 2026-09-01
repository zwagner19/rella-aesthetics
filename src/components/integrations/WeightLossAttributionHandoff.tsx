"use client";

import { useEffect } from "react";
import {
  isCurrentAttributionCaptureAcknowledgement,
  planAttributionConsentTransition,
  readAttributionConsent,
  WEIGHT_LOSS_ATTRIBUTION_CONSENT_EVENT,
  type AttributionConsentState,
} from "@/lib/attribution-consent";
import {
  clearAttributionDenialSentinel,
  hasAttributionDenialSentinel,
  writeAttributionDenialSentinel,
} from "@/lib/attribution-denial-sentinel";
import {
  createAbortableAttributionCapture,
  type AbortableAttributionCapture,
} from "@/lib/attribution-capture-request";
import { createAttributionRequestQueue } from "@/lib/attribution-request-queue";
import {
  ensureAttributionRevocationHandle,
  readAttributionRevocationHandle,
  rotateAttributionRevocationHandle,
  type AttributionRevocationHandleRotation,
} from "@/lib/attribution-revocation-handle";
import { createAttributionRevocationRetry } from "@/lib/attribution-revocation-retry";
import { isWeightLossHost } from "@/lib/site-hosts";
import {
  postWeightLossAttribution,
  resolveWeightLossAttribution,
  revokeWeightLossAttribution,
  stripWeightLossAttributionFromPageHref,
  WEIGHT_LOSS_ATTRIBUTION_STORAGE_KEY,
  type WeightLossAttributionSessionStorage,
} from "@/lib/weight-loss-attribution";

function sessionStorageOrNull(): WeightLossAttributionSessionStorage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Consent-gated first-party attribution capture for the exact weight-loss host.
 * It renders nothing and never emits a booking-complete or ad-conversion event.
 */
export function WeightLossAttributionHandoff() {
  useEffect(() => {
    if (!isWeightLossHost(window.location.hostname)) return;

    let active = true;
    let acknowledged = false;
    let captureAttempt: AbortableAttributionCapture | null = null;
    let captureInFlight = false;
    let captureGeneration = 0;
    let consentState: AttributionConsentState = "unknown";
    let postDenialRotation: AttributionRevocationHandleRotation | null = null;
    let storageResolved = false;
    let storage: WeightLossAttributionSessionStorage | null = null;
    const requestQueue = createAttributionRequestQueue();
    const revocation = createAttributionRevocationRetry({
      getState: () => ({
        active,
        consentState,
        generation: captureGeneration,
        online: navigator.onLine !== false,
        visible: document.visibilityState === "visible",
      }),
      getRevocationHandle: () => readAttributionRevocationHandle(
        document.cookie,
      ),
      enqueue: (request) => requestQueue.enqueue(request),
      revoke: (signal, revocationHandle) => revokeWeightLossAttribution({
        marketingOrigin: window.location.origin,
        pathname: window.location.pathname,
        fetchImpl: window.fetch.bind(window),
        revocationHandle,
        signal,
      }),
      onAcknowledged: () => {
        if (active && consentState === "granted") applyConsentState();
      },
    });

    function attributionStorage() {
      if (!storageResolved) {
        storage = sessionStorageOrNull();
        storageResolved = true;
      }
      return storage;
    }

    function cleanPageUrl() {
      const clean = stripWeightLossAttributionFromPageHref(window.location.href);
      if (clean !== window.location.href) {
        window.history.replaceState(window.history.state, "", clean);
      }
    }

    function currentAttribution() {
      return resolveWeightLossAttribution(
        window.location.search,
        attributionStorage(),
      );
    }

    function removeSessionFallback() {
      try {
        attributionStorage()?.removeItem(WEIGHT_LOSS_ATTRIBUTION_STORAGE_KEY);
      } catch {
        // The server cookie is authoritative after ack; denial removes fallback.
      }
    }

    function applyConsentState() {
      const nextConsentState = readAttributionConsent(
        window.__rellaWeightLossAttributionConsent,
      );
      const transition = planAttributionConsentTransition(
        consentState,
        nextConsentState,
      );
      if (transition.changed) captureGeneration += 1;
      consentState = nextConsentState;

      if (consentState === "unknown") {
        if (transition.changed) captureAttempt?.abort();
        revocation.pause();
        return;
      }

      if (transition.revoke) {
        acknowledged = false;
        if (transition.changed) postDenialRotation = null;
        writeAttributionDenialSentinel(
          window.location.hostname,
          document,
        );
        captureAttempt?.abort();
        if (transition.changed) {
          revocation.require({ resetBackoff: true });
        }
        removeSessionFallback();
        cleanPageUrl();
        revocation.retryNow();
        return;
      }

      const denialSentinelPresent = hasAttributionDenialSentinel(
        document.cookie,
      );
      const retainedRevocationHandle = readAttributionRevocationHandle(
        document.cookie,
      );
      if (denialSentinelPresent && !retainedRevocationHandle) {
        const preflightHandle = ensureAttributionRevocationHandle(
          window.location.hostname,
          document,
        );
        if (!preflightHandle) return;
        revocation.require({ resetBackoff: true });
        revocation.retryNow();
        return;
      }
      if (!revocation.isAcknowledged() && denialSentinelPresent) {
        revocation.require();
      }
      if (revocation.isRequired() || revocation.isInFlight()) {
        revocation.retryNow();
        return;
      }
      const attribution = currentAttribution();

      if (acknowledged || captureInFlight) return;
      if (Object.keys(attribution).length === 0) return;
      const rotatePostDenialHandle =
        denialSentinelPresent && postDenialRotation === null;
      const rotation = rotatePostDenialHandle
        ? rotateAttributionRevocationHandle(
            window.location.hostname,
            document,
          )
        : null;
      if (rotatePostDenialHandle && !rotation) return;
      if (rotation) postDenialRotation = rotation;
      const revocationHandle = rotation?.revocationHandle ??
        ensureAttributionRevocationHandle(
            window.location.hostname,
            document,
          );
      if (!revocationHandle) return;
      const revocationPredecessorHandle = denialSentinelPresent
        ? postDenialRotation?.revocationPredecessorHandle ?? undefined
        : undefined;
      captureInFlight = true;
      const requestGeneration = captureGeneration;
      void requestQueue.enqueue(() => {
        if (
          !active ||
          consentState !== "granted" ||
          requestGeneration !== captureGeneration ||
          readAttributionRevocationHandle(document.cookie) !== revocationHandle
        ) {
          return Promise.resolve(false);
        }
        const attempt = createAbortableAttributionCapture((signal) => (
          postWeightLossAttribution({
            attribution,
            consentState,
            marketingOrigin: window.location.origin,
            pathname: window.location.pathname,
            fetchImpl: window.fetch.bind(window),
            revocationHandle,
            revocationPredecessorHandle,
            signal,
          })
        ));
        captureAttempt = attempt;
        return attempt.promise.finally(() => {
          if (captureAttempt === attempt) captureAttempt = null;
        });
      }).then((serverAcknowledged) => {
        captureInFlight = false;
        if (!isCurrentAttributionCaptureAcknowledgement({
          active,
          serverAcknowledged,
          consentState,
          requestGeneration,
          currentGeneration: captureGeneration,
        })) {
          if (
            active &&
            consentState === "granted" &&
            requestGeneration !== captureGeneration
          ) {
            applyConsentState();
          }
          return;
        }
        acknowledged = true;
        postDenialRotation = null;
        clearAttributionDenialSentinel(window.location.hostname, document);
        removeSessionFallback();
        cleanPageUrl();
      });
    }

    window.addEventListener(
      WEIGHT_LOSS_ATTRIBUTION_CONSENT_EVENT,
      applyConsentState,
    );
    window.addEventListener("online", applyConsentState);
    function retryWhenVisible() {
      if (document.visibilityState === "visible") applyConsentState();
    }
    document.addEventListener("visibilitychange", retryWhenVisible);
    applyConsentState();

    return () => {
      active = false;
      captureAttempt?.abort();
      revocation.dispose();
      window.removeEventListener(
        WEIGHT_LOSS_ATTRIBUTION_CONSENT_EVENT,
        applyConsentState,
      );
      window.removeEventListener("online", applyConsentState);
      document.removeEventListener("visibilitychange", retryWhenVisible);
    };
  }, []);

  return null;
}
