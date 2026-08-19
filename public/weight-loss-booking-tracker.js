/**
 * Drop-in confirmed-booking tracker for book.rellaweightloss.com.
 *
 * Add once to the booking app layout:
 *   <script src="https://weightloss.experiencerella.com/weight-loss-booking-tracker.js" defer></script>
 *
 * Sterile payload only. Fires at most once per browser session when the SPA
 * shows the confirmed "You're booked!" screen (step === "done").
 */
(function weightLossBookingTracker() {
  var GTM_ID = "GTM-N4R7NHBJ";
  var EVENT = "weight_loss_booking_confirmed";
  var SERVICE = "weight-loss-consult";
  var DEDUPE_KEY = "rella_wl_booking_conv_fired";

  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.location.hostname !== "book.rellaweightloss.com") return;

  var pathMatch = window.location.pathname.match(
    /^\/book\/(napa|vacaville)\/weight-loss-consult\/?$/,
  );
  if (!pathMatch) return;
  var location = pathMatch[1];

  try {
    if (window.sessionStorage.getItem(DEDUPE_KEY) === "1") return;
  } catch (_err) {
    /* sessionStorage blocked */
  }

  window.dataLayer = window.dataLayer || [];

  if (!document.querySelector('script[src*="googletagmanager.com/gtm.js"]')) {
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    var gtmScript = document.createElement("script");
    gtmScript.async = true;
    gtmScript.src =
      "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(GTM_ID);
    document.head.appendChild(gtmScript);
  }

  var fired = false;

  function pushConfirmed() {
    if (fired) return;
    try {
      if (window.sessionStorage.getItem(DEDUPE_KEY) === "1") {
        fired = true;
        return;
      }
    } catch (_err) {
      /* continue */
    }

    window.dataLayer.push({
      event: EVENT,
      location: location,
      service: SERVICE,
      booking_confirmed: true,
    });

    fired = true;
    try {
      window.sessionStorage.setItem(DEDUPE_KEY, "1");
    } catch (_err) {
      /* continue */
    }
  }

  function isConfirmedScreen() {
    var heading = document.getElementById("ok-h");
    if (heading) return true;
    var h2 = document.querySelector("h2.rb-steph");
    if (h2 && /you.?re booked!/i.test(h2.textContent || "")) return true;
    return false;
  }

  function scan() {
    if (isConfirmedScreen()) pushConfirmed();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }

  var observer = new MutationObserver(function () {
    scan();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
