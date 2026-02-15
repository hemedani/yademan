# Event Gets API Migration Guide

## Overview

This document describes the changes made to migrate the Event `gets` API from skip-based pagination to page-based pagination with structured metadata response.

## Date
Updated: December 2024

---

## Backend Changes

### New API Structure

The Event `gets` endpoint now follows a standardized structure with:

1. **Page-based Pagination**: Uses `page` and `limit` instead of `skip` and `limit`
2. **Structured Response**: Returns `{ data: [], metadata: {} }` instead of a flat array
3. **Enhanced Filtering**: Supports comprehensive filter options
4. **Standardized Sort Options**: Only `_id` and `startTime` sorting supported

### Request Structure (set)

#### Required Parameters
- `page`: Number - The page number to retrieve (1-indexed)
- `limit`: Number - Number of events per page

#### Optional Filters
- `name`: String - Filter events by name (case-insensitive search)
- `status`: Enum - Filter by status: "draft" | "published" | "archived" | "cancelled"
- `isPublic`: Boolean - Filter by public visibility
- `registrarId`: String (ObjectId) - Filter by registrar user ID
- `organizerId`: String (ObjectId) - Filter by organizer user ID
- `placeIds`: String[] (ObjectId[]) - Filter by place IDs
- `tagIds`: String[] (ObjectId[]) - Filter by tag IDs
- `startTimeAfter`: String (ISO date) - Filter events starting after this time
- `startTimeBefore`: String (ISO date) - Filter events starting before this time
- `endTimeAfter`: String (ISO date) - Filter events ending after this time
- `endTimeBefore`: String (ISO date) - Filter events ending before this time

#### Sort Options
- `sort`: Object with sorting parameters:
  - `_id`: 1 | -1 (1 for ascending, -1 for descending)
  - `startTime`: 1 | -1 (1 for ascending, -1 for descending)

**Note**: `name` sorting is no longer supported by the backend.

### Response Structure (get)

The response now requires specifying both `data` and `metadata` objects:

```typescript
{
  data: {
    // Event fields to retrieve (0 or 1)
    _id?: 0 | 1;
    name?: 0 | 1;
    description?: 0 | 1;
    // ... other event fields
    registrar?: { /* nested fields */ };
    places?: { /* nested fields */ };
    organizer?: { /* nested fields */ };
    tags?: { /* nested fields */ };
    thumbnail?: { /* nested fields */ };
    gallery?: { /* nested fields */ };
  };
  metadata: {
    total?: 0 | 1;      // Total count of matching events
    page?: 0 | 1;       // Current page number
    limit?: 0 | 1;      // Page size
    pageCount?: 0 | 1;  // Total number of pages
  };
}
```

### Response Data

The API returns:
```typescript
{
  success: boolean;
  body: {
    data: EventSchema[];      // Array of event objects
    metadata: {
      total: number;          // Total matching events
      page: number;           // Current page
      limit: number;          // Items per page
      pageCount: number;      // Total pages
    };
  };
}
```

---

## Frontend Changes

### Files Modified

1. **`src/app/actions/event/gets.ts`** ✅ (Already updated by backend team)
   - Updated to use new ReqType structure

2. **`src/app/[locale]/events/EventsPageContent.tsx`** ✅ (Updated)
   - Changed from skip-based to page-based pagination
   - Updated query structure to wrap fields in `data` object
   - Added `metadata` object to get request
   - Parse `response.body.data` and `response.body.metadata`
   - Use metadata for accurate pagination control
   - Removed `name` sorting (replaced with `_id` sorting)

3. **`src/components/EventsList.tsx`** ✅ (Updated)
   - Changed from skip-based to page-based pagination
   - Updated query structure with `data` and `metadata` objects
   - Parse `response.body.data` instead of `response.body`

4. **`messages/en.json`** ✅ (Updated)
   - Changed `sortByNameAsc` → `sortByIdAsc`: "ID (Ascending)"
   - Changed `sortByNameDesc` → `sortByIdDesc`: "ID (Descending)"

5. **`messages/fa.json`** ✅ (Updated)
   - Changed `sortByNameAsc` → `sortByIdAsc`: "شناسه (صعودی)"
   - Changed `sortByNameDesc` → `sortByIdDesc`: "شناسه (نزولی)"

### Code Changes Summary

#### Before (Old API)
```typescript
const response = await getEvents({
  set: {
    limit: 12,
    skip: (page - 1) * 12,
    status: "published",
  },
  get: {
    _id: 1,
    name: 1,
    // ... other fields
  },
});

if (response.success && Array.isArray(response.body)) {
  setEvents(response.body);
  setHasMore(response.body.length === ITEMS_PER_PAGE);
}
```

#### After (New API)
```typescript
const response = await getEvents({
  set: {
    page: page,
    limit: 12,
    status: "published",
  },
  get: {
    data: {
      _id: 1,
      name: 1,
      // ... other fields
    },
    metadata: {
      total: 1,
      page: 1,
      limit: 1,
      pageCount: 1,
    },
  },
});

if (response.success && response.body?.data) {
  const { data, metadata } = response.body;
  setEvents(data);
  setTotalCount(metadata.total || 0);
  setPageCount(metadata.pageCount || 0);
  setHasMore(page < (metadata.pageCount || 0));
}
```

### Pagination Logic Changes

#### Skip-based (Old)
```typescript
const skip = (page - 1) * limit;
// Estimated if more exist based on returned count
const hasMore = events.length === limit;
```

#### Page-based (New)
```typescript
const currentPage = 1; // 1-indexed
// Accurate pagination from metadata
const hasMore = currentPage < metadata.pageCount;
const totalEvents = metadata.total;
```

### Sort Options Changes

#### Before
- Date (Ascending/Descending)
- Name (A-Z / Z-A)

#### After
- Date (Oldest First / Newest First) - using `startTime`
- ID (Ascending / Descending) - using `_id`

---

## Migration Checklist

### For Developers

- [x] Update EventsPageContent.tsx to use page-based pagination
- [x] Update EventsList.tsx to use page-based pagination
- [x] Wrap query fields in `data` object
- [x] Add `metadata` object to query
- [x] Parse `response.body.data` instead of `response.body`
- [x] Use `metadata` for pagination state
- [x] Remove name-based sorting
- [x] Update translation keys for sort options
- [x] Update both English and Persian translations

### Testing Steps

1. **Basic Listing**
   - [ ] Navigate to `/[locale]/events`
   - [ ] Verify events load correctly
   - [ ] Check that event cards display all information
   - [ ] Verify pagination shows correct total count

2. **Pagination**
   - [ ] Click "Load More" button
   - [ ] Verify new events append to list
   - [ ] Check that "Load More" disappears on last page
   - [ ] Verify page count is accurate

3. **Sorting**
   - [ ] Test "Newest First" (startTime descending)
   - [ ] Test "Oldest First" (startTime ascending)
   - [ ] Test "ID (Ascending)" (_id ascending)
   - [ ] Test "ID (Descending)" (_id descending)
   - [ ] Verify sort persists when loading more

4. **Filtering**
   - [ ] Open filters panel
   - [ ] Apply status filter (draft/published/archived/cancelled)
   - [ ] Apply date range filters
   - [ ] Apply tag filters
   - [ ] Combine multiple filters
   - [ ] Verify reset filters works

5. **EventsList Component**
   - [ ] Check sidebar/widget areas using EventsList
   - [ ] Verify upcoming events load
   - [ ] Test with different limits
   - [ ] Verify click navigation to event details

6. **Error Handling**
   - [ ] Test with no results
   - [ ] Test with API errors
   - [ ] Verify retry button works
   - [ ] Check loading states

7. **Localization**
   - [ ] Test in English locale
   - [ ] Test in Persian locale
   - [ ] Verify all new translation keys work
   - [ ] Check RTL layout in Persian

8. **Performance**
   - [ ] Monitor API response times
   - [ ] Check for unnecessary re-renders
   - [ ] Verify smooth pagination transitions
   - [ ] Test with large datasets

---

## Breaking Changes

### 1. Response Structure
**Impact**: HIGH  
**Before**: `response.body` was an array  
**After**: `response.body` is an object with `data` and `metadata`

### 2. Pagination Method
**Impact**: HIGH  
**Before**: Skip-based with `skip` parameter  
**After**: Page-based with `page` parameter (1-indexed)

### 3. Sort Options
**Impact**: MEDIUM  
**Before**: Supported `name`, `startTime`, `_id`  
**After**: Only supports `startTime` and `_id`

### 4. Request Structure
**Impact**: HIGH  
**Before**: Fields directly in `get` object  
**After**: Fields wrapped in `get.data` object, with separate `get.metadata`

---

## Common Issues & Solutions

### Issue 1: Events not loading
**Symptom**: Empty list or error message  
**Solution**: Check that query uses `page` instead of `skip`, and wraps fields in `data` object

### Issue 2: Pagination not working
**Symptom**: "Load More" button doesn't work or shows incorrectly  
**Solution**: Verify you're reading `metadata.pageCount` and comparing with current page

### Issue 3: Sort by name not working
**Symptom**: Name sorting doesn't change order  
**Solution**: Name sorting is no longer supported. Use `_id` or `startTime` sorting instead

### Issue 4: Type errors
**Symptom**: TypeScript errors about missing fields  
**Solution**: Ensure you're using the updated `ReqType["main"]["event"]["gets"]` type

---

## Benefits of New Structure

1. **Accurate Pagination**: Metadata provides exact page count and total items
2. **Better Performance**: Page-based pagination is more efficient than skip-based
3. **Consistency**: Matches API patterns used across the application
4. **Flexibility**: Metadata can be extended with additional information
5. **Type Safety**: Strongly typed request/response structure

---

## API Reference

### Example Request
```typescript
import { gets as getEvents } from "@/app/actions/event/gets";

const response = await getEvents({
  set: {
    page: 1,
    limit: 12,
    status: "published",
    isPublic: true,
    startTimeAfter: new Date().toISOString(),
    sort: {
      startTime: -1, // Newest first
    },
  },
  get: {
    data: {
      _id: 1,
      name: 1,
      description: 1,
      startTime: 1,
      endTime: 1,
      status: 1,
      thumbnail: {
        _id: 1,
        name: 1,
      },
      places: {
        _id: 1,
        name: 1,
        center: 1,
      },
      tags: {
        _id: 1,
        name: 1,
        color: 1,
      },
    },
    metadata: {
      total: 1,
      page: 1,
      limit: 1,
      pageCount: 1,
    },
  },
});
```

### Example Response
```typescript
{
  success: true,
  body: {
    data: [
      {
        _id: "507f1f77bcf86cd799439011",
        name: "Cultural Heritage Tour",
        description: "Explore ancient sites...",
        startTime: "2024-12-25T10:00:00.000Z",
        endTime: "2024-12-25T18:00:00.000Z",
        status: "published",
        thumbnail: {
          _id: "507f191e810c19729de860ea",
          name: "tour-thumbnail.jpg"
        },
        places: [...],
        tags: [...]
      },
      // ... more events
    ],
    metadata: {
      total: 45,
      page: 1,
      limit: 12,
      pageCount: 4
    }
  }
}
```

---

## Support & Questions

For issues or questions about this migration:
1. Check this document first
2. Review the type definitions in `src/types/declarations/selectInp.ts`
3. Look at the updated implementation in `EventsPageContent.tsx`
4. Consult the backend API documentation

---

## Version History

- **v2.0** (December 2024): Page-based pagination with metadata response
- **v1.0** (Previous): Skip-based pagination with flat array response
