# Install confirmed-booking tracking on book.rellaweightloss.com

The booking app lives outside this repo. Add **one script tag** to its root layout
(before `</body>`):

```html
<script
  src="https://weightloss.experiencerella.com/weight-loss-booking-tracker.js"
  defer
></script>
```

After deploy, the script will:

1. Load `GTM-N4R7NHBJ` on the booking subdomain
2. Wait for the **"You're booked!"** confirmation screen (`#ok-h`)
3. Push `weight_loss_booking_confirmed` **once** per session (Napa or Vacaville from URL)

No patient data is sent — only `location`, `service`, and `booking_confirmed`.

Then complete GTM Preview using `docs/GTM-WEIGHT-LOSS-CONVERSION-PREVIEW.md`.
