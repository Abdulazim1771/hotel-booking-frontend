# Frontend testing

## Check the current design

Open [the browser prototype](../design/prototype/preview.html) and search for a room, confirm a demo stay, and cancel it in **My bookings**. In **Staff view**, check arrivals and edit a nightly rate. Reload to reset the demo data.

## Test the integrated application

Add browser tests under [tests/e2e](../tests/e2e/README.md) as React and the Reservations endpoints arrive. Use a seeded backend and separate guest and staff sessions. Cover a complete booking and cancellation first, then price and availability conflicts during checkout and staff access.
