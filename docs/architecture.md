# Frontend architecture

The [shared project plan](project-plan.md) covers both repositories and defines the large single-hotel scope and delivery order. The [design guide](../design/MASTER.md) defines the planned visual system and screen behavior. The current browser prototype uses demo data and the earlier design. The React implementation will live in `src/`.

Group React routes and components around hotel content, room catalogue, availability, booking, and staff. Public pages cover the hotel, rooms and suites, dining, wellness, events, gallery, and location. The staff area covers reservations, floors and rooms, assignments, arrivals/departures, room blocks, and rates as their backend use cases arrive. Keep reusable controls such as date fields, dialogs, and status badges together once more than one feature uses them. Keep the last valid search in the URL so dates and guest count survive a reload or a return from sign-in. Do not put guest contact details or session credentials in the URL.

The backend owns availability, prices, and booking state. Preserve a guest's selection during sign-in. If checkout returns a conflict, keep the search inputs and show the revised price or room choices. See the [integration guide](api-integration.md).

Display room categories to guests and physical room numbers/floors to authorized staff. Do not calculate sellable inventory or enforce assignment conflicts solely in React. Begin with one room per reservation and the current total guest count; room-count and child-age controls depend on agreed backend extensions. Hotel editorial content can start as versioned frontend data, while room identifiers, occupancy, prices, and availability must agree with backend records.
