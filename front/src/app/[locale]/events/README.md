# Events Feature

This directory contains the complete implementation of the events feature for the Naghshe application, fully implementing the event schema from the backend.

## Structure

```
events/
├── page.tsx                    # Main events list page wrapper
├── EventsPageContent.tsx       # Events list with filtering and pagination
├── [_id]/
│   ├── page.tsx               # Single event detail page wrapper
│   └── EventDetailContent.tsx # Event detail with map integration
└── README.md                  # This file
```

## Components

### EventCard (`/src/components/events/EventCard.tsx`)

A beautiful card component for displaying event information in the list view.

**Features:**

- Displays event thumbnail or custom icon/color
- Shows status badges (published, draft, archived, cancelled)
- Public/private event indicator
- Event time and date information
- Associated places with icons
- Tags with custom colors
- Price and registration information
- Organizer details
- Gradient hover effects inspired by the crypto wallet design

**Props:**

- `event`: eventSchema - The event data object
- `locale`: string - Current locale (fa or en)

### EventFilters (`/src/components/events/EventFilters.tsx`)

Advanced filtering component for events list.

**Features:**

- Search by event name
- Filter by status (draft, published, archived, cancelled)
- Filter by tags (multi-select)
- Date range filtering (start and end dates)
- Public events only toggle
- Registration required toggle
- Apply and reset filters
- Beautiful dark-themed UI with gradients

**Props:**

- `onFilterChange`: (filters: any) => void - Callback when filters change
- `onClose`: () => void - Optional close handler
- `isOpen`: boolean - Whether filters panel is visible

### EventsPageContent (`/src/app/[locale]/events/EventsPageContent.tsx`)

Main events list page with filtering, sorting, and pagination.

**Features:**

- Grid layout (responsive: 1 col mobile, 2 tablet, 3 desktop)
- Advanced filtering panel
- Sorting options (by date or name, ascending/descending)
- Pagination with "Load More" button
- Loading states with skeleton cards
- Empty state with reset filters option
- Error handling with retry
- Event count display
- Smooth animations with Framer Motion

### EventDetailContent (`/src/app/[locale]/events/[_id]/EventDetailContent.tsx`)

Detailed event page with full information and map integration.

**Features:**

- Hero section with image gallery
- Full event details display
- Status and visibility indicators
- Date and time information
- Location list with descriptions
- Route visualization on map with pathfinding
- Organizer and registrar information
- Registration and event URL buttons
- Tags display
- Ticket price or free indicator
- Capacity information
- Image gallery with thumbnail navigation
- Map integration for visualizing event locations
- Back to events button

## Event Schema Implementation

The implementation covers all fields from the backend event schema:

### Pure Fields

- ✅ `name` - Event title
- ✅ `description` - Event details
- ✅ `startTime` - Event start date/time
- ✅ `endTime` - Event end date/time
- ✅ `color` - Custom color for display
- ✅ `icon` - Icon identifier
- ✅ `capacity` - Attendance capacity
- ✅ `status` - draft, published, archived, cancelled
- ✅ `isPublic` - Public/private visibility
- ✅ `ticketPrice` - Cost information
- ✅ `registrationRequired` - Registration requirement
- ✅ `maxAttendees` - Maximum capacity
- ✅ `eventUrl` - External event link
- ✅ `registrationUrl` - Registration link
- ✅ `createdAt` - Creation timestamp
- ✅ `updatedAt` - Update timestamp

### Relationships

- ✅ `registrar` - User who registered the event
- ✅ `places` - Associated locations with map display
- ✅ `organizer` - Event organizer details
- ✅ `tags` - Event categorization tags
- ✅ `thumbnail` - Event main image
- ✅ `gallery` - Multiple event images

## Features

### Filtering System

The events can be filtered by:

- **Name**: Text search
- **Status**: draft | published | archived | cancelled
- **Tags**: Multi-select tag filtering
- **Date Range**: Filter by start and end dates
- **Public Only**: Show only public events
- **Registration Required**: Show events requiring registration

### Sorting Options

Events can be sorted by:

- **Date**: Oldest first or newest first
- **Name**: Alphabetically (A-Z or Z-A)

### Map Integration

Events with associated places feature:

- Route visualization from user's location
- Pathfinding algorithm for optimal visit order
- Interactive map display
- Location markers with details
- Total distance calculation

### Internationalization

Full support for:

- Persian (fa-IR) locale
- English (en-US) locale
- RTL/LTR layout switching
- Date formatting per locale
- All UI text translated

## API Integration

### List Events

```typescript
import { gets as getEvents } from "@/app/actions/event/gets";

const response = await getEvents({
  set: {
    limit: 12,
    skip: 0,
    status: "published",
    tagIds: ["tag-id-1", "tag-id-2"],
    isPublic: true,
    startTimeAfter: new Date().toISOString(),
    sort: { startTime: -1 },
  },
  get: {
    _id: 1,
    name: 1,
    description: 1,
    startTime: 1,
    endTime: 1,
    // ... other fields
  },
});
```

### Get Single Event

```typescript
import { get as getEvent } from "@/app/actions/event/get";

const response = await getEvent(eventId, {
  _id: 1,
  name: 1,
  description: 1,
  // ... other fields with relationships
  places: {
    _id: 1,
    name: 1,
    center: 1,
  },
});
```

## Design Philosophy

The events feature is inspired by modern crypto wallet UIs with:

- Dark theme with gradients (pink #FF007A to purple #7B2FF7)
- Smooth animations and transitions
- Card-based layouts with hover effects
- Clean, minimalist interface
- Emphasis on visual hierarchy
- Responsive design for all screen sizes

## Usage Example

```typescript
// In a Next.js page
import EventCard from "@/components/events/EventCard";
import { eventSchema } from "@/types/declarations/selectInp";

function MyEventsPage({ events }: { events: eventSchema[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event._id} event={event} locale="en" />
      ))}
    </div>
  );
}
```

## Future Enhancements

Potential improvements:

- [ ] Event registration form integration
- [ ] Calendar view for events
- [ ] User's saved/favorited events
- [ ] Social sharing functionality
- [ ] iCalendar export
- [ ] Event reminders
- [ ] Similar events recommendations
- [ ] Event attendance tracking
- [ ] Review/rating system for past events

## Troubleshooting

### Translation Errors

If you see `MISSING_MESSAGE` errors in the console, ensure:

- Translation keys exist in both `messages/en.json` and `messages/fa.json`
- When using translations from different namespaces, use separate `useTranslations()` hooks:

  ```typescript
  const t = useTranslations("Events");
  const tCommon = useTranslations("Common");

  // Correct usage:
  {
    t("eventTitle");
  }
  {
    tCommon("retry");
  }

  // Incorrect:
  {
    t("Common.retry");
  } // Will fail!
  ```

### Module Resolution Errors

If TypeScript shows "Cannot find module" errors for existing files:

- This is usually a TypeScript language server cache issue
- Try restarting your IDE/editor
- The files exist and will work at runtime
- Run `pnpm build` to verify actual build errors

### Map Not Displaying

If the map doesn't appear on event detail pages:

- Check that events have associated `places` with valid coordinates
- Ensure `NEXT_PUBLIC_LESAN_URL` environment variable is set
- Map uses dynamic imports - check browser console for loading errors

## Notes

- All components use "use client" directive for client-side interactivity
- Server actions are used for all API calls following project conventions
- Map integration uses dynamic imports to avoid SSR issues
- Pathfinding algorithm calculates optimal route between multiple locations
- Image optimization using Next.js Image component
- Responsive design with mobile-first approach
