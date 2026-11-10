# Frontend architecture

The [design guide](../design/MASTER.md) defines the visual system and screen behavior. The current browser prototype uses demo data. The React implementation will live in `src/`.

Group React routes and components around availability, booking, and staff. Keep reusable controls such as date fields, dialogs, and status badges together once more than one feature uses them. Keep the last valid search in the URL so dates and guest count survive a reload or a return from sign-in.

The backend owns availability, prices, and booking state. Preserve a guest's selection during sign-in. If checkout returns a conflict, keep the search inputs and show the revised price or room choices. See the [integration guide](api-integration.md).
