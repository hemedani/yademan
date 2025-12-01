# Timeline Slider Filter Implementation

## Overview

This document describes the implementation of the timeline filter slider component for the Naghshe frontend application.

## Components Created

### 1. TimelineSlider Component (`/src/components/organisms/TimelineSlider.tsx`)

A comprehensive horizontal timeline slider component that allows users to filter places by their antiquity (age in years).

#### Features:

- Horizontal timeline with visual track and draggable handle
- Reset button with animated label that appears on hover
- Numeric display showing exact value
- Tick marks every 10 years, with major ticks at 50-year intervals and very major ticks at 1000-year intervals
- Tooltips showing exact values when hovering/dragging
- Visual feedback during dragging with scale and glow effects
- Internationalization support (English and Persian)

#### Functionality:

- **Drag-to-adjust**: Users can drag the handle or the timeline track to change the antiquity value
- **Animated reset**: Reset button returns the slider to year 0 with an attractive spring animation
- **Real-time filtering**: Updates map markers in real-time as the value changes
- **Precision**: Supports precise selection with 4px per year movement
- **Visual feedback**: Animations during dragging and hover states

### 2. Map Store Integration (`/src/stores/mapStore.ts`)

Extended the map store to support antiquity filtering.

#### Changes:

- Added `antiquity` field to the filters interface
- Added `setAntiquityFilter` action to update the filter in the store

### 3. Interactive Map Integration (`/src/components/map/InteractiveMap.tsx`)

Integrated the antiquity filter into the map's filtering system.

#### Changes:

- Added antiquity filter logic to the existing filter useEffect
- Added filtering condition: `place.antiquity >= filters.antiquity`

### 4. Main Page Integration (`/src/app/[locale]/page.tsx`)

Added the timeline slider to the main page layout.

#### Changes:

- Imported the TimelineSlider component
- Positioned the slider at the bottom of the page
- Adjusted page padding to accommodate the slider
- Added proper z-index and positioning

### 5. Internationalization (`/messages/en.json`, `/messages/fa.json`)

Added translations for all slider UI elements.

#### New Translation Keys:

- `timelineSlider`
- `years`
- `reset`
- `resetTooltip`
- `showSitesOlderThan`

## User Experience

### How It Works

1. The slider allows users to filter places by their antiquity (age in years)
2. The range is from 0 to 10000 years, with higher values representing older sites
3. As the user adjusts the slider:
   - The map updates in real-time to show only places with antiquity >= selected value
   - A large numeric display shows the exact value
   - Tick marks highlight when they're at or before the current value
   - A vertical center line indicates the current selected time
4. The reset button instantly returns the slider to year 0 with a smooth animation

### Visual Design

- Dark theme consistent with the rest of the application
- Gradient track from #FF007A (pink) to #A020F0 (purple)
- White handle with hover/tap animations and drag state effects
- Tooltips with precise value information
- Responsive design that works on different screen sizes
- Reset button with attractive hover animation revealing text

## Technical Details

### Filtering Logic

The antiquity filter is applied on the client side after places are fetched from the backend:

```typescript
// Apply antiquity filter
if (filters.antiquity !== undefined && filters.antiquity >= 0) {
  filtered = filtered.filter((place) => {
    return place.antiquity >= filters.antiquity!;
  });
}
```

### State Management

- The slider value is synchronized with the map store
- Changes trigger map updates via the useEffect in InteractiveMap
- The filter is persisted in the store alongside other filters
- Track position is calculated as -value \* 4 (4px per year)

### Animation Implementation

- Smooth spring animation for reset functionality using Framer Motion
- Conditional animations based on dragging state (no transition while dragging)
- Hover animations for the reset button with text sliding in
- Drag state animations for the handle (scale and glow)

### Performance Considerations

- The filtering happens efficiently on the client side
- The map updates are optimized using the existing marker management system
- Animation transitions are optimized to prevent lag during dragging
- Large track width (80,000px) supports full range with 4px per year precision

## Known Limitations

1. The slider range (0-10000 years) is hardcoded and may not reflect the full range of actual data
2. The animation speed during reset is fixed with no user control
3. The track is a very wide element (80,000px) which could cause performance issues on some devices

## Implemented Enhancements

1. Added reset button with attractive SVG icon
2. Implemented smooth reset animation with spring transition
3. Added hover-activated text label to the reset button
4. Added dragging animations with handle scaling and glow effects
5. Fixed floating point display to show rounded integer values
6. Optimized dragging performance by conditionally disabling transitions
7. Added animations to the center reference line during dragging
8. Fixed height issues to ensure all content is visible without scrolling
9. Added smooth transitions for the tooltip during dragging
