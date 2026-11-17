# Hotel Booking Design

Design the website and booking system for one large five-star hotel; its brand name has not been chosen. The [shared project plan](../docs/project-plan.md) covers both frontend and backend work. Design for a high-rise property with several hundred rooms, while keeping the guest journey focused on room categories and stay details.

The new direction takes visual inspiration from Rosewood Hong Kong and booking clarity from Jing An Shangri-La. Use original branding and owned, licensed, or generated photographs. Large hotel and skyline images, warm neutral surfaces, elegant headings, and restrained dark-green actions should communicate luxury.

The current HTML prototype retains the earlier midnight/white/lime palette and smaller feature set. It is a demo flow reference; the following direction applies to the forthcoming React implementation. This planning change does not update the prototype.

## Brand and component tokens

| Token | Value | Role |
|---|---|---|
| Warm ivory | `#FAF9F4` | Main editorial background |
| White | `#FFFFFF` | Booking forms, room cards, and staff surfaces |
| Charcoal | `#1C2320` | Body text and headings |
| Deep green | `#073D31` | Primary actions and selected navigation |
| Muted stone | `#D8D5CC` | Dividers and decorative boundaries |

- These tokens are the proposed implementation starting point. Verify text, controls, error states, and focus contrast during the React design phase; muted stone is decorative and must not be the sole input boundary where contrast is insufficient.
- Use white text on deep-green actions. Pair status colors with written states such as **Confirmed**, **Cancelled**, or **Sold out**. Use a visible focus ring and labeled fields throughout.
- Use Georgia for editorial headings and Segoe UI or a system sans serif for navigation, prices, and forms. Prefer generous spacing and restrained corners. Use consistent component spacing rather than making the booking form resemble an editorial image.
- On desktop, use a wide hotel photograph with a readable introduction and a prominent horizontal booking bar. On narrow screens, stack the fields and room cards, retain a clear booking action, and keep navigation usable. If video is introduced, provide a still-image fallback and respect reduced-motion preferences.

## Homepage and public pages

Follow this order: navigation and Book a Stay action; hero photograph and introduction; booking bar; hotel overview; featured rooms and suites; dining; wellness; supported offers; meetings and weddings; location and practical information. See the [homepage content table](../docs/project-plan.md#homepage) for details.

Provide a room catalogue, individual room-type detail pages, and supporting dining, wellness, events, gallery, and location pages. Room details include photographs, size, bed type, maximum occupancy, view, amenities, accessibility information, and the booking action. Show actual stay prices only after a valid search; label any illustrative prototype amounts as demo data.

Dining, wellness, and events initially provide information and contact/enquiry routes. Do not present working reservation forms for services that lack booking support. Render a language selector only when localized content exists. Offers must correspond to implemented bookable rates or packages.

## Guest screens

| Screen | Design |
|---|---|
| Hotel and search | Lead with the property photograph and a form for check-in, checkout, and guest count. Initially support one room per reservation. Separate adult/child inputs and room count require completed backend rules. |
| Availability | Keep dates and guest count visible. Show room category, beds, size, occupancy, view, supported rate inclusions, and the full stay total. Label sold-out choices and provide a way to revise the search. |
| Sign-in and review | Preserve the selected category and dates across sign-in. Show required guest details, nightly breakdown when supplied, dates, guest count, currency, taxes/fees as supplied by the backend, full total, pay-at-hotel terms, and cancellation cutoff before confirmation. |
| Confirmation | Give the booking reference visual priority, restate the stay details, and link to **My bookings**. |
| My bookings | List the room category, dates, total, reference, and written status. Confirm cancellation in a dialog and show the updated status in place. Do not imply that a physical room number is guaranteed when only a category has been reserved. |

## Staff screens

Use the same palette with compact forms and tables. Keep staff navigation separate from guest booking. Enable each operation only when its backend use case exists.

| Screen | Planned behavior |
| --- | --- |
| Reservations | Search bookings and inspect the guest, stay, category, state, and assignment |
| Arrivals and departures | Default to the hotel's current date, show stays for the selected day, and expose agreed check-in/out actions |
| Floors and rooms | Filter physical rooms by floor, category, and operational availability; support several hundred rooms without one oversized floor map |
| Assignment | Assign a compatible room for the entire stay; explain conflicting assignments or blocks |
| Room blocks | Record date-bounded maintenance/unavailability and show effects or conflicts before saving |
| Room rates | Edit supported nightly rates and show save/conflict feedback; existing bookings retain their confirmed totals |

## React handoff

- Map these tokens to semantic shadcn/ui roles, including background, foreground, primary, primary-foreground, border, and ring. Share buttons, labeled fields, status badges, and dialogs across guest and staff screens.
- Preserve the last valid search during loading. Show a field-level message when dates are invalid. If availability changes during checkout, return the guest to room selection with their dates intact. If the price changes, show the revised total and ask for confirmation again.
- The browser prototype uses sample rooms, USD rates, a demo sign-in, generated property imagery, and temporary reservations. It resets on reload. The product will use the hotel's configured time zone and currency. Physical room/floor data and operational status belong to the backend, not browser-only state.
