# Frontend testing

## Check the current design

Open [the browser prototype](../design/prototype/preview.html) and search for a room, confirm a demo stay, and cancel it in **My bookings**. In **Staff view**, check arrivals and edit a nightly rate. Reload to reset the demo data. This prototype reflects the earlier design; it does not verify the new large-hotel scope or the planned React application.

## Test the integrated application

Add browser tests under [tests/e2e](../tests/e2e/README.md) as React and the Reservations endpoints arrive. Use a seeded backend and separate guest and staff sessions. Cover a complete booking and cancellation first, then price and availability conflicts during checkout and staff access.

Follow the [shared delivery phases](project-plan.md#delivery-phases). Check public navigation, catalogue and room details, mobile booking, keyboard focus, labeled forms, and readable contrast. Verify preservation of dates and selections across sign-in and failed requests. Room-count, child pricing, packages, and online payments must not appear as usable features before their backend rules are implemented.

For staff workflows, cover reservation search, floor/room filtering, assignment for the complete stay, overlapping assignments, room blocks, arrivals/departures, and rate edits that preserve confirmed booking totals. Use representative several-hundred-room fixtures while keeping individual browser cases focused.

Backend integration checks remain in the backend repository. They must cover concurrent confirmation, inventory rollback and release, idempotency, guest ownership, staff permissions, room-assignment/block consistency, and later outbox recovery and payment expiry. Frontend mocks cannot establish that these transaction rules are correct. Define measurable performance goals before assessing load-test results.
