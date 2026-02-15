# Event Gets API Migration - Summary

## What Changed?

The backend implementation for the Event `gets` API was updated from **skip-based pagination** to **page-based pagination** with a structured metadata response.

## Key Changes

### 1. Pagination Method
- **Before**: `skip` and `limit` parameters
- **After**: `page` (1-indexed) and `limit` parameters

### 2. Response Structure
- **Before**: `response.body` returned a flat array of events
- **After**: `response.body` returns an object with:
  - `data`: Array of event objects
  - `metadata`: Object with `{ total, page, limit, pageCount }`

### 3. Request Structure
- **Before**: Fields specified directly in `get` object
- **After**: Fields wrapped in `get.data` object, with separate `get.metadata` object

### 4. Sort Options
- **Removed**: Name-based sorting (no longer supported by backend)
- **Available**: Only `_id` and `startTime` sorting

## Files Updated

✅ **src/app/[locale]/events/EventsPageContent.tsx**
- Changed pagination from skip to page-based
- Wrapped query fields in `data` object
- Added `metadata` to query
- Updated response parsing to use `response.body.data` and `response.body.metadata`
- Replaced name sorting with ID sorting
- Added accurate pagination using metadata

✅ **src/components/EventsList.tsx**
- Changed pagination from skip to page-based
- Wrapped query fields in `data` object
- Updated response parsing to use `response.body.data`

✅ **messages/en.json**
- Updated sort translation keys:
  - `sortByNameAsc` → `sortByIdAsc`: "ID (Ascending)"
  - `sortByNameDesc` → `sortByIdDesc`: "ID (Descending)"

✅ **messages/fa.json**
- Updated sort translation keys:
  - `sortByNameAsc` → `sortByIdAsc`: "شناسه (صعودی)"
  - `sortByNameDesc` → `sortByIdDesc`: "شناسه (نزولی)"

✅ **EVENT_GETS_API_MIGRATION.md** (Created)
- Comprehensive migration guide with examples and testing checklist

## Code Example

### Before (Old API)
```typescript
const response = await getEvents({
  set: {
    limit: 12,
    skip: (page - 1) * 12,
  },
  get: {
    _id: 1,
    name: 1,
    startTime: 1,
  },
});

if (response.success && Array.isArray(response.body)) {
  setEvents(response.body);
}
```

### After (New API)
```typescript
const response = await getEvents({
  set: {
    page: page,
    limit: 12,
  },
  get: {
    data: {
      _id: 1,
      name: 1,
      startTime: 1,
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
  setHasMore(page < (metadata.pageCount || 0));
}
```

## Available Filters (Backend)

The new API supports these filters in the `set` object:

**Basic Filters:**
- `name` - String (case-insensitive search)
- `status` - Enum: "draft" | "published" | "archived" | "cancelled"
- `isPublic` - Boolean

**Relation Filters:**
- `registrarId` - ObjectId string
- `organizerId` - ObjectId string
- `placeIds` - Array of ObjectId strings
- `tagIds` - Array of ObjectId strings

**Time Filters:**
- `startTimeAfter` - ISO date string
- `startTimeBefore` - ISO date string
- `endTimeAfter` - ISO date string
- `endTimeBefore` - ISO date string

**Sort:**
- `sort.startTime` - 1 (ascending) or -1 (descending)
- `sort._id` - 1 (ascending) or -1 (descending)

## Benefits

1. ✅ **Accurate Pagination**: Exact page count and total items from metadata
2. ✅ **Better Performance**: Page-based is more efficient than skip-based
3. ✅ **Consistency**: Matches other API endpoints in the project
4. ✅ **Type Safety**: Fully typed with `ReqType["main"]["event"]["gets"]`
5. ✅ **Rich Metadata**: Easy to display "Showing X of Y" information

## Testing Checklist

- [ ] Load events page - verify events display
- [ ] Click "Load More" - verify pagination works
- [ ] Test sorting options - verify all 4 sort combinations work
- [ ] Apply filters - verify filtering works correctly
- [ ] Test in both English and Persian locales
- [ ] Verify empty state shows when no events
- [ ] Test error handling with retry button
- [ ] Check EventsList component in sidebar/widgets

## Breaking Changes Summary

| What | Before | After | Impact |
|------|--------|-------|--------|
| Response | Flat array | `{ data, metadata }` object | HIGH |
| Pagination | `skip` | `page` (1-indexed) | HIGH |
| Query Structure | Direct fields | Wrapped in `data` | HIGH |
| Sort by Name | Supported | Not supported | MEDIUM |

## Next Steps

1. **Test the implementation** - Use the testing checklist above
2. **Monitor for issues** - Watch for runtime errors in production
3. **Update documentation** - If you have API docs, update them
4. **Educate team** - Share this summary with other developers

## Need Help?

- Review `EVENT_GETS_API_MIGRATION.md` for detailed guide
- Check type definitions in `src/types/declarations/selectInp.ts`
- Look at implemented code in `EventsPageContent.tsx`
- Review backend API documentation

---

**Migration completed**: December 2024  
**Status**: ✅ Ready for testing
