# Hotel Booking System: shared project plan

Updated: 2026-11-17. Scope: both `hotel-booking-frontend` and `hotel-booking-backend`.

## Product direction

Build the public website and direct booking system for one large five-star hotel. The hotel's brand name has not been chosen. Use a roughly 50-floor tower with several hundred rooms as the design reference; the exact floor count, room count, location, currency, and time zone are configurable hotel data. Ten rooms per floor is an example, not a business rule. Public facilities and larger suites may occupy entire floors or reduce the room count.

The public website introduces the hotel, accommodation, dining, wellness, events, and location. The booking journey lets guests reserve accommodation and manage their stays. A separate staff area supports reservations and the hotel's physical room inventory.

This roadmap covers both repositories and is maintained here. Backend implementation and its API documentation remain in the companion repository. This planning update does not implement features or change backend contracts; new requirements below must be reflected in the backend's architecture and API guides during the corresponding phase. Existing backend API behavior takes precedence over proposed contracts until they are implemented and documented.

## Research references

| Reference | Relevant observation | Direction for this project |
| --- | --- | --- |
| [Jing An Shangri-La, Shanghai](https://www.shangri-la.com/shanghai/jinganshangrila/) | 508 rooms and suites on levels 30–59; date search, accommodation, offers, wellness, and events | Use as a scale reference and an example of clear booking controls |
| [Waldorf Astoria Dubai DIFC](https://www.hilton.com/en/hotels/dxbwawa-waldorf-astoria-dubai-international-financial-centre/) | Luxury high-rise accommodation on floors 18–50, with dining, spa, and concierge services | Present views, room features, and hotel services clearly |
| [Rosewood Hong Kong](https://www.rosewoodhotels.com/en/hong-kong) | Large photographs, spacious layouts, accommodation categories, dining, and wellness | Use as visual inspiration for a calm luxury presentation |

These are research references, not branding, content, or image assets to copy. Use an original hotel identity and owned, licensed, or generated imagery. Research findings were reviewed on 2026-11-17.

## Current baseline

| Area | Observed status |
| --- | --- |
| Frontend | Design guide and interactive HTML prototype exist; `src/` is reserved for React |
| Existing prototype | Demo data, temporary bookings, demo sign-in, arrivals, and rate editing; resets on reload |
| Reservations backend | .NET 10, PostgreSQL availability search, health endpoint, and generated OpenAPI are implemented |
| Booking, authentication, and staff APIs | Controller placeholders return HTTP 501; implementation is planned |
| Notifications and Payments | Milestone notes exist; workers and payment simulation are planned |

The existing prototype represents the earlier smaller scope and palette. It is a flow reference until the luxury design phase replaces it.

## Public website and booking scope

### Homepage

| Order | Section | Required content |
| --- | --- | --- |
| 1 | Header | Logo, Rooms & Suites, Dining, Wellness, Events, Gallery, My Bookings, language selection when supported, and Book a Stay |
| 2 | Hero | Strong hotel or skyline photograph, short hotel introduction, and a booking action |
| 3 | Booking bar | Check-in, checkout, and party details; add room count and child ages only when supported by the agreed API |
| 4 | Hotel introduction | Location, character, views, and signature facilities |
| 5 | Rooms & Suites | Featured categories with photographs, size, bed type, occupancy, view, and links to details |
| 6 | Dining | Restaurants, breakfast, lounge, room service, and enquiry/contact details |
| 7 | Wellness | Spa, swimming pool, gym, facilities, and opening hours |
| 8 | Offers | Only packages or rates that the booking system can actually quote; omit unsupported promotions |
| 9 | Meetings & Weddings | Venue photographs, capacities, and contact/enquiry entry point |
| 10 | Location and footer | Map, address, airport access, contact details, check-in/out times, cancellation information, and FAQ |

Provide dedicated room catalogue and room detail pages, with supporting dining, wellness, events, gallery, and location content. Initially, dining, spa, and event pages provide information and contact routes; online table, treatment, and venue booking are future extensions.

### Guest journey

Search dates and party size, compare available room categories, choose a supported rate, sign in, enter required guest details, review the full stay total and terms, confirm, and receive a booking reference. Guests can then view their bookings and cancel within policy.

Start with one room per reservation and the existing `guests` input. Multi-room booking, separate adult/child pricing, and child-age inputs require explicit inventory, occupancy, and pricing rules before being exposed. Finalize these extensions in phase 1; they are not supported by the current availability contract.

The first booking release uses payment at the hotel. Define one bookable rate per room type initially; add breakfast packages or flexible/non-refundable alternatives only when their pricing and cancellation rules are implemented. Online payments are a later milestone.

## Hotel and reservation rules

| Concept | Planned responsibility |
| --- | --- |
| Hotel configuration | One hotel with its own time zone, currency, contact information, and stay policies |
| Floor | Configurable identifier and use, such as accommodation or public facilities; no fixed ten-room assumption |
| Physical room | Unique room number, floor, room type, and operational availability; staff manage room assignment |
| Room type | Bookable category with size, beds, view, accessibility, amenities, and occupancy limits |
| Nightly inventory | Reservations owns sellable capacity by room type and date, independently of the public catalogue |
| Rate | Backend-owned nightly prices and explicit inclusions/terms; confirmation stores the agreed total |
| Reservation | Guest, room type, dates, party, agreed price and policy, reference, and booking state |
| Room assignment | Staff assign a physical room compatible with the reservation; overlapping assignments are prohibited |
| Room block | Date-bounded maintenance or operational block; coordinated with inventory and existing bookings |

Guests book a category such as Deluxe King City View. Staff can later assign a room such as 3207 on floor 32. Exact room selection and public floor maps are not part of the initial guest flow. Availability must cover the entire stay; assignment must also find a compatible room for the entire stay or require an explicitly handled room move. The implementation must not assume that nightly capacity alone guarantees a continuous physical-room assignment.

Preserve the existing backend design: Reservations owns inventory and bookings in PostgreSQL, with Domain, Application, Infrastructure, and API layers. Booking rechecks price and capacity and reserves all nights atomically. Keep idempotency, ownership checks, conflict handling, and cancellation release in the backend. Do not introduce a separate inventory service for this expansion.

Capacity reductions, physical-room blocks, assignment, and cancellation must remain consistent under concurrent requests. Reject or explicitly resolve changes that would invalidate confirmed stays. Confirmed prices remain unchanged when staff edit rates. Keep operational room status separate from reservation status. Agree exact status transitions before implementing check-in and checkout.

## Delivery phases

Work proceeds by phase across both repositories. A phase is complete when its acceptance criteria are demonstrated and its contracts, documentation, and progress status are updated. Do not treat planned features as completed.

| Phase | Backend work | Frontend work | Completion criteria |
| --- | --- | --- | --- |
| 1. Hotel model and contract decisions | Review current schema; define floor/room/type mapping, assignment and block rules, occupancy, rates, and cancellation policy; design migrations and API changes | Finalize sitemap, content model, booking inputs, guest/staff roles, and screen states | Shared rules and API changes documented; initial release scope is unambiguous; implemented availability behavior accounted for |
| 2. Luxury design and React foundation | Confirm availability/OpenAPI integration and required catalogue data; add public hotel/room metadata contracts where needed | Replace the earlier visual direction; create responsive homepage, catalogue, room details, supporting hotel pages, shared controls, routes, and API client | React runs; public pages work on mobile and desktop; demo content is identified; keyboard interaction and contrast checked |
| 3. Hotel inventory and availability | Add configurable floors and physical rooms, inventory consistency rules, and representative development seed data; extend availability only as agreed in phase 1 | Connect real availability; display category features, occupancy, nightly breakdown when supplied, stay totals, loading, invalid dates, and sold-out states | Search uses real backend data; complete-stay inventory and any room blocks are respected; generated TypeScript matches OpenAPI |
| 4. Guest booking and cancellation | Implement session sign-in, ownership, atomic pay-at-hotel confirmation, idempotency, price/capacity conflicts, booking queries, and cancellation | Implement sign-in with preserved selections, review, confirmation, My Bookings, and cancellation | A guest can book and cancel; competing requests cannot oversell; retries do not duplicate bookings; unauthorized access is rejected |
| 5. Staff hotel operations | Implement authorized arrivals/departures, reservation search, room assignment, room blocks, rates, and agreed check-in/out transitions | Build staff reservation screens, floor/room list with filters, assignment controls, arrivals/departures, rate editor, and availability/block views | Staff can operate the seeded hotel; assignment conflicts and invalid blocks are prevented; rate edits preserve confirmed totals |
| 6. Notifications and reliability | Add transactional outbox, RabbitMQ relay, Notifications worker, delivery deduplication, and operational diagnostics | Display accurate confirmation/delivery state where needed; retain usable booking details during delivery failures | A broker outage does not lose a confirmed booking; recovery delivers without duplicate delivery records; booking concurrency and failure checks pass |
| 7. Release validation | Validate migrations, authorization, backup/recovery procedure, and realistic search/booking load; document deployment | Run guest/staff browser tests, responsive/accessibility checks, and content review | End-to-end flows pass against seeded PostgreSQL; agreed load goals are measured; runbook and configuration examples are current |
| 8. Optional payment and commercial extensions | Add simulated payment attempts, expiring holds, retry/expiry/late-approval handling; later assess a real provider | Add supported payment states and rate packages; add multi-room/child pricing only with completed backend rules | Simulation handles approvals, declines, expiry, and recovery; real payments require a separately agreed provider scope |

Phases 1–7 deliver the initial hotel website, pay-at-hotel booking, and staff operations. Phase 8 is optional and follows a stable core. Hotel content can begin as versioned frontend data; an editing CMS is a separate requirement if needed. Do not advertise operational capabilities that do not exist.

## Verification priorities

- Backend: stay dates in the hotel time zone, room occupancy, price calculation, inventory across every night, 50 concurrent attempts for one remaining room, idempotent retries, rollback, repeated cancellation, guest ownership, and staff access.
- Hotel operations: overlapping assignments, continuous room availability across a stay, maintenance blocks, capacity reductions against confirmed stays, and rates that leave existing totals intact.
- Frontend: the complete booking/cancellation journey, sign-in state preservation, changed-price and sold-out responses, staff authorization, small-screen layouts, and keyboard access.
- Reliability: broker interruption and replay, duplicate events, migration from existing inventory, and later payment expiry and late approvals.
- Scale: seed several hundred physical rooms across representative floors and establish measurable latency/concurrency goals before load testing. Fifty floors is a modelling example, not a performance target.

## Progress

Research and the shared planning update are complete. Delivery phase 1 is next. Existing backend availability is implemented; its extension to the larger hotel model remains planned. No React application, booking use cases, or new room-management APIs were implemented by this update.
