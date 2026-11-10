# Backend integration

The Reservations API in the companion `hotel-booking-backend` repository owns the HTTP interface. The current backend can be checked at `http://127.0.0.1:5080/health/live`.

When availability lands, configure the React development server to proxy `/api` to Reservations. The first call will be `GET /api/availability` with check-in, checkout, and guest count. The API returns stay totals in the hotel currency.

Generate TypeScript types from the backend's generated OpenAPI document once the first endpoint is available. When the interface changes, refresh the types and run the frontend type check. Keep response handling close to the feature that displays it.

Use the planned same-origin sign-in flow with session cookies. Follow the backend's CSRF requirements for booking and rate changes. Handle price and availability conflicts by preserving search dates and asking the guest to review the new options.
