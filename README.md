# Hotel Booking System Frontend

The planned React website and booking frontend for one large five-star hotel. Guests will explore rooms, dining, wellness, and events, search availability, and book with payment at the hotel. Staff will manage reservations, room assignments, floor and room inventory, arrivals, and rates.

The [shared project plan](docs/project-plan.md) covers both the frontend and the companion .NET backend, with delivery phases and completion criteria. The hotel is modelled as a high-rise property with several hundred rooms; its floors and room distribution are configurable.

## Preview the design

Open [the interactive prototype](design/prototype/preview.html) in a browser from a local checkout. Try the booking flow or select **Staff view** to see arrivals and room rates. The prototype uses demo data and resets on reload.

The prototype represents the earlier design and smaller scope. The [design guide](design/MASTER.md) describes the new luxury direction for the React implementation; the prototype has not yet been redesigned.

## Project layout

- [Source](src/) is reserved for the React application.
- [Shared project plan](docs/project-plan.md) defines product scope and backend/frontend delivery phases.
- [Design](design/) contains the guide, prototype, and images.
- [Architecture](docs/architecture.md) and [API integration](docs/api-integration.md) describe the planned React app and its connection to Reservations.
- [Testing](docs/testing.md) explains how to check the prototype and where to add browser tests.

The backend lives in the companion `hotel-booking-backend` repository. This repository previously hosted an [employee-management exercise](https://github.com/Abdulazim1771/hotel-booking-frontend/tree/c4ac02ee5a8c694ad38efc91584d96cd1348b28b).
