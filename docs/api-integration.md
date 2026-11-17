# Backend integration

The Reservations API in the companion `hotel-booking-backend` repository owns the HTTP interface. Its API behavior guide and generated OpenAPI define implemented contracts. The [shared project plan](project-plan.md) identifies proposed extensions for the larger hotel; those extensions are not live endpoints. The backend health endpoint is `http://127.0.0.1:5080/health/live`.

Availability search is already implemented in the backend. When React is created, configure its development server to proxy `/api` to Reservations. Call `GET /api/availability` with `checkIn`, `checkOut` (calendar dates in `yyyy-MM-dd` format), and `guests` (a positive integer). The response contains stay dates, nights, currency, guest count, and room categories with availability and stay totals. An unavailable category can have `isAvailable: false`; an empty list means no category fits the party and dates. Do not interpret it as an API failure.

Generate TypeScript types from the backend's Development OpenAPI document at `/openapi/v1.json`. When the interface changes, refresh the types and run the frontend type check. Keep response handling close to the feature that displays it. Authentication, booking, and existing staff controller placeholders currently return HTTP 501; enable their UI actions only when the relevant use cases are implemented.

Use the planned same-origin sign-in flow with session cookies. Follow the backend's CSRF requirements for booking and rate changes. Handle price and availability conflicts by preserving search dates and asking the guest to review the new options.

The initial booking flow uses one room, total guest count, and payment at the hotel. Do not send invented `rooms`, `adults`, `children`, child-age, rate-plan, or floor-preference parameters to the existing availability endpoint. Agree their contracts and pricing rules before adding those controls. Public room metadata and staff floor, room assignment, block, and departure contracts are planned during the shared roadmap; no new route names are committed here.

Booking writes will recheck price and inventory and support an `Idempotency-Key`; retain the same key for retries of the same attempt and use a new key for a changed attempt. Render HTTP 400 field errors, 401/403 authentication or access failures, and 409 price/capacity conflicts distinctly. Exact error payloads and write contracts must be finalized with the backend. Treat successful booking and notification delivery as separate outcomes.
