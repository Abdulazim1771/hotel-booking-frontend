# Hotel Booking Design

**STILL Hotel** is a working name for the single-property design. The guest experience pairs a midnight-black editorial hero with monochrome hotel photography and a white booking surface. One prominent lime action leads from choosing dates to confirming the stay.

## Brand and component tokens

| Token | Value | Role |
|---|---|---|
| Midnight black | `#101114` | Headings, body text, dark surfaces, focus rings on white |
| Pure white | `#FFFFFF` | Forms, room cards, staff tables, text on dark surfaces |
| Lime green | `#C8F745` | Primary actions, confirmation badges, small accents on midnight |

- Set lime buttons in midnight text. Midnight on lime is **15.1:1**, midnight on white is **18.9:1**, and lime on white is **1.25:1**. Pair status colors with text such as **Confirmed**, **Cancelled**, or **Sold out**. Derive dividers and muted surfaces from midnight and white.
- Use Georgia for editorial headings and Segoe UI or a system sans serif for navigation, prices, and forms. Set buttons and inputs in a 4 px spacing rhythm. Use 6 px corners for controls and 10 px corners for cards and panels.
- On desktop, use a split hero, a horizontal date form, and three room cards. On narrow screens, stack the hero, put the guest count and availability button on full-width rows, and show one room card per row. Keep keyboard focus visible in the booking form and dialogs.

## Guest screens

| Screen | Design |
|---|---|
| Hotel and search | Lead with the property photograph and a form for check-in, checkout, and guests. Show room types, occupancy, and per-night rates for browsing. |
| Availability | Keep dates and guest count visible. Show the total for the requested nights, label sold-out choices, and let guests change their search when there are no results. |
| Sign-in and review | Preserve the room and dates across sign-in. Show the nightly rate, dates, guest count, total, pay-at-hotel terms, and cancellation cutoff before confirmation. |
| Confirmation | Give the booking reference visual priority, restate the stay details, and link to **My bookings**. |
| My bookings | List the room, dates, total, reference, and written status. Confirm cancellation in a dialog and show the updated status in place. |

## Staff screens

Use the same palette and a compact layout. **Arrivals** defaults to the hotel’s current date and shows confirmed bookings for the selected day. **Room rates** shows one editable nightly rate per room type and confirms when the rates are saved. Existing bookings retain their confirmed totals.

## React handoff

- Map these tokens to semantic shadcn/ui roles, including background, foreground, primary, primary-foreground, border, and ring. Share buttons, labeled fields, status badges, and dialogs across guest and staff screens.
- Preserve the last valid search during loading. Show a field-level message when dates are invalid. If availability changes during checkout, return the guest to room selection with their dates intact. If the price changes, show the revised total and ask for confirmation again.
- The browser prototype uses sample rooms, USD rates, a demo sign-in, generated property imagery, and temporary reservations. It resets on reload. The product will use the hotel’s configured time zone and currency.
