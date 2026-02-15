# Event Gets API - Quick Reference Card

## 🚀 Quick Start

```typescript
import { gets as getEvents } from "@/app/actions/event/gets";

const response = await getEvents({
  set: {
    page: 1,           // Required: 1-indexed page number
    limit: 12,         // Required: items per page
    status: "published", // Optional: filter by status
  },
  get: {
    data: {            // Wrap fields in data object
      _id: 1,
      name: 1,
      startTime: 1,
    },
    metadata: {        // Request metadata
      total: 1,
      pageCount: 1,
    },
  },
});

// Access results
const events = response.body.data;           // Event array
const total = response.body.metadata.total;  // Total count
const pages = response.body.metadata.pageCount; // Total pages
```

---

## 📋 Request Parameters

### Required (in `set`)
```typescript
{
  page: number,   // 1, 2, 3... (NOT 0-indexed)
  limit: number   // e.g., 10, 20, 50
}
```

### Optional Filters (in `set`)
```typescript
{
  name?: string,                    // "Cultural Tour"
  status?: "draft" | "published"    // "published"
    | "archived" | "cancelled",
  isPublic?: boolean,               // true
  registrarId?: string,             // ObjectId
  organizerId?: string,             // ObjectId
  placeIds?: string[],              // ["id1", "id2"]
  tagIds?: string[],                // ["id1", "id2"]
  startTimeAfter?: string,          // "2024-12-25T00:00:00Z"
  startTimeBefore?: string,         // "2024-12-31T23:59:59Z"
  endTimeAfter?: string,            // ISO date
  endTimeBefore?: string,           // ISO date
  sort?: {
    _id?: 1 | -1,                   // 1=asc, -1=desc
    startTime?: 1 | -1,             // 1=asc, -1=desc
  }
}
```

---

## 📤 Response Structure

```typescript
{
  success: boolean,
  body: {
    data: EventSchema[],     // Your events array
    metadata: {
      total: number,         // Total matching events
      page: number,          // Current page
      limit: number,         // Items per page
      pageCount: number,     // Total pages
    }
  }
}
```

---

## 🎯 Common Use Cases

### 1. Load First Page
```typescript
const response = await getEvents({
  set: { page: 1, limit: 12 },
  get: {
    data: { _id: 1, name: 1, startTime: 1 },
    metadata: { total: 1, pageCount: 1 },
  },
});
```

### 2. Load More (Pagination)
```typescript
const currentPage = 2;
const response = await getEvents({
  set: { page: currentPage, limit: 12 },
  get: { data: { /* fields */ }, metadata: { pageCount: 1 } },
});

// Check if more pages exist
const hasMore = currentPage < response.body.metadata.pageCount;
```

### 3. Filter by Status
```typescript
const response = await getEvents({
  set: {
    page: 1,
    limit: 12,
    status: "published",
  },
  get: { /* ... */ },
});
```

### 4. Filter by Date Range
```typescript
const response = await getEvents({
  set: {
    page: 1,
    limit: 12,
    startTimeAfter: new Date().toISOString(), // Future events
  },
  get: { /* ... */ },
});
```

### 5. Sort by Newest First
```typescript
const response = await getEvents({
  set: {
    page: 1,
    limit: 12,
    sort: { startTime: -1 }, // -1 = descending (newest)
  },
  get: { /* ... */ },
});
```

### 6. Filter by Multiple Tags
```typescript
const response = await getEvents({
  set: {
    page: 1,
    limit: 12,
    tagIds: ["tag_id_1", "tag_id_2"],
  },
  get: { /* ... */ },
});
```

### 7. Full Query with Nested Data
```typescript
const response = await getEvents({
  set: {
    page: 1,
    limit: 12,
    status: "published",
    isPublic: true,
  },
  get: {
    data: {
      _id: 1,
      name: 1,
      description: 1,
      startTime: 1,
      endTime: 1,
      thumbnail: { _id: 1, name: 1 },
      places: { _id: 1, name: 1, center: 1 },
      tags: { _id: 1, name: 1, color: 1 },
      organizer: { _id: 1, first_name: 1, last_name: 1 },
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

---

## ⚠️ Common Mistakes

### ❌ DON'T: Use skip
```typescript
// OLD WAY - NO LONGER WORKS
set: { skip: 10, limit: 10 }
```

### ✅ DO: Use page
```typescript
// NEW WAY
set: { page: 2, limit: 10 }
```

### ❌ DON'T: Access response.body directly as array
```typescript
// WRONG
const events = response.body;
```

### ✅ DO: Access response.body.data
```typescript
// CORRECT
const events = response.body.data;
const metadata = response.body.metadata;
```

### ❌ DON'T: Put fields directly in get
```typescript
// WRONG
get: {
  _id: 1,
  name: 1,
}
```

### ✅ DO: Wrap fields in data object
```typescript
// CORRECT
get: {
  data: {
    _id: 1,
    name: 1,
  },
  metadata: { total: 1 }
}
```

### ❌ DON'T: Try to sort by name
```typescript
// NOT SUPPORTED
sort: { name: 1 }
```

### ✅ DO: Sort by _id or startTime only
```typescript
// SUPPORTED
sort: { startTime: -1 }  // or
sort: { _id: 1 }
```

---

## 🔢 Pagination Helper

```typescript
// Calculate pagination info
const currentPage = metadata.page;
const totalPages = metadata.pageCount;
const totalItems = metadata.total;
const itemsPerPage = metadata.limit;
const hasNextPage = currentPage < totalPages;
const hasPrevPage = currentPage > 1;

// Show "Showing X-Y of Z"
const startItem = (currentPage - 1) * itemsPerPage + 1;
const endItem = Math.min(currentPage * itemsPerPage, totalItems);
// "Showing 11-20 of 45"
```

---

## 🧪 Testing Template

```typescript
// Test pagination
console.log("Page:", response.body.metadata.page);
console.log("Total:", response.body.metadata.total);
console.log("Pages:", response.body.metadata.pageCount);
console.log("Count:", response.body.data.length);

// Verify response
if (response.success && response.body?.data) {
  console.log("✅ Success:", response.body.data.length, "events loaded");
} else {
  console.error("❌ Error:", response.body?.message);
}
```

---

## 📚 Type Reference

```typescript
import { ReqType } from "@/types/declarations/selectInp";

type EventGetsRequest = ReqType["main"]["event"]["gets"];
```

---

## 🔗 Related Files

- Implementation: `src/app/[locale]/events/EventsPageContent.tsx`
- Action: `src/app/actions/event/gets.ts`
- Types: `src/types/declarations/selectInp.ts`
- Full Guide: `EVENT_GETS_API_MIGRATION.md`

---

**Last Updated**: December 2024
