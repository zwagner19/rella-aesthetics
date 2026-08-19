# GTM copy-paste: AW-6868918996 Napa confirmed booking

Paste these into **GTM-N4R7NHBJ** in Preview. Do **not** edit legacy
`AW-11321678537` tags.

## 1. Constant variable (one-time)

| Name | Type | Value |
|---|---|---|
| `AW Napa Booking Label` | Constant | `<paste label from Google Ads>` |

From Google Ads → Goals → Conversions → **Book Appointment - Form Submit - New**
→ Tag setup → copy only the part after the slash in
`AW-6868918996/XXXXXXXX`.

## 2. Data Layer variables

| Name | Data Layer Variable Name |
|---|---|
| `DLV - location` | `location` |
| `DLV - booking_confirmed` | `booking_confirmed` |

## 3. NEW Google tag

| Field | Value |
|---|---|
| Tag type | Google tag |
| Tag ID | `AW-6868918996` |
| Trigger | All Pages |

## 4. NEW trigger

| Field | Value |
|---|---|
| Type | Custom Event |
| Event name | `weight_loss_booking_confirmed` |
| Fire when | `DLV - location` equals `napa` **AND** `DLV - booking_confirmed` equals `true` |

## 5. NEW conversion tag

| Field | Value |
|---|---|
| Tag type | Google Ads Conversion Tracking |
| Conversion ID | `6868918996` |
| Conversion label | `{{AW Napa Booking Label}}` |
| Conversion linker | Enabled |
| Trigger | Trigger from step 4 |
| Tag firing options | Once per event |

## 6. Conversion Linker (edit existing)

Enable cross-domain linking for:

- `rellaweightloss.com`
- `book.rellaweightloss.com`
- `weightloss.experiencerella.com`

## 7. Preview checklist

- [ ] Legacy AW-11321678537 tags still present (not paused)
- [ ] New AW-6868918996 tag fires **once** on simulated confirmation
- [ ] No conversion on "See Napa Call Times" click alone
- [ ] User explicitly says **publish** before submitting container
