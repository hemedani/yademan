# Naghshe Frontend - Next.js Application

## Project Overview

The Naghshe frontend is a Next.js 15 application built with React 19, Tailwind CSS, and TypeScript. It serves as the user-facing component of the Naghshe platform, which appears to be a geographic information system focused on managing and exploring places and locations in Iran. The application features mapping capabilities, virtual tours, localization support, and authentication.

### Key Features

- **Interactive Mapping**: Built with MapLibre GL and Leaflet for displaying geographic locations
- **Virtual Tours**: 360-degree virtual tour functionality using Photo Sphere Viewer
- **Internationalization**: Support for Persian (fa) and English (en) locales
- **Progressive Web App (PWA)**: Offline capabilities with service worker support
- **Responsive Design**: Mobile-first approach with responsive UI components
- **Authentication**: JWT-based authentication system with user roles
- **Search & Filtering**: Advanced search and filtering capabilities for locations
- **Admin Panel**: Administrative interface for managing content

### Architecture

- **Frontend Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: Zustand for application state, React Context for auth
- **Maps**: MapLibre GL, Leaflet with drawing capabilities
- **UI Components**: Headless UI, Heroicons, Framer Motion for animations
- **Forms**: React Hook Form with Zod validation
- **Virtual Tours**: Photo Sphere Viewer for 360° imagery
- **Internationalization**: next-intl for i18n support
- **API Communication**: Custom API service layer for connecting to backend

## Building and Running

### Development Environment

```bash
# Install dependencies with pnpm
pnpm install

# Run the development server
pnpm dev

# The app will be available at:
# - http://localhost:3000 (or the port specified in environment)
# - Development with Turbopack via `pnpm dev`
```

### Production Build

```bash
# Build the application for production
pnpm build

# Start the production server
pnpm start

# The app will be available at:
# - http://localhost:${APP_PORT:-3000} (default port 3005 in Docker)
```

### Environment Configuration

The application uses several environment variables:

- `LESAN_URL` - Internal backend URL (server-side)
- `NEXT_PUBLIC_LESAN_URL` - Public backend URL (client-side)
- `APP_PORT` - Application port (default: 3005)

## Development Conventions

### Code Structure

- `/src/app` - Next.js 13+ App Router pages and layouts
- `/src/components` - Reusable UI components organized by atomic design principles
- `/src/context` - React Context providers for state management
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions and libraries
- `/src/services` - API service layer
- `/src/stores` - Zustand stores for global state
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions
- `/i18n` - Internationalization configuration
- `/public` - Static assets

### TypeScript

- Strict TypeScript configuration with type checking
- Type definitions for API schemas in `/src/types/declarations`
- Component props are strongly typed

### Internationalization

- The application supports Persian (fa) and English (en) locales with fa as the default locale
- Uses next-intl for internationalization with automatic locale detection and routing
- Translation files are located in the `/messages` directory as `fa.json` and `en.json`
- Direction changes automatically based on locale (RTL for Persian, LTR for English)
- Locale routing is configured in `i18n/routing.ts` with middleware handling locale redirects
- Supports locale-specific URLs (e.g., `/fa/products` or `/en/products`) with automatic redirects for locale addition
- Excludes admin routes from locale-based routing (admin routes are accessible without locale prefix)
- Locale information is stored in cookies to remember user's preferred locale
- The application uses next-intl's navigation functions (Link, redirect, usePathname, useRouter) for locale-aware navigation
- Internationalization is integrated with Next.js App Router through middleware and request.ts configuration

### Styling

- Tailwind CSS v4 with custom configuration in `tailwind.config.ts`
- Custom dark theme defined in `/src/app/dark-theme.css`
- Responsive design with mobile-first approach
- Component-specific styling follows atomic design principles

### Authentication

- JWT-based authentication system
- React Context for auth state management
- Automatic token refresh and user data synchronization
- User roles: Ghost, Manager, Editor, Normal

### Mapping

- MapLibre GL for high-performance map rendering
- Leaflet for additional interactive map features
- Location data is fetched and displayed dynamically
- Drawing capabilities for creating custom shapes on the map

## Key Configuration Files

- `next.config.ts` - Next.js configuration with PWA and i18n plugins
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `package.json` - Dependencies and scripts
- `Dockerfile` - Multi-stage Docker configuration for development and production
- `middleware.ts` - Internationalization routing middleware
- `i18n/routing.ts` - Locale routing configuration

## Project Guidelines

The following are general project guidelines that you must follow and are repeated in all prompts:

You are a front-end persona highly proficient in Next.js, with deep expertise in UI/UX design. Always prioritize creating the most beautiful, intuitive, and visually stunning website possible, ensuring seamless user experiences, responsive layouts, and elegant aesthetics throughout your suggestions and implementations.

Use `pnpm` instead of `npm` or `yarn` when executing any Node.js-related commands.

For all backend interactions, the actual response or error data is nested within a `body` object. Example success shape (e.g., for login):

```
{
  "success": true,
  "body": {
    "token": "23423423rrsdfsagssfas2342",
    "user": {
      "_id": "sdfsdf3423422344",
      "name": "Amir",
      // ... additional user fields
    }
  }
}
```

Example error shape (e.g., for login):

```
{
  "success": false,
  "body": {
    "message": "Failed"
  }
}
```

If you want to know backend API declaration and type-safety you can read `src/types/declarations/selectInp.ts` file which include all schemas and backend API calls.

If you encounter any problems with the structure of the Lesan library used for the backend, you can use its documentation (here)[https://miaadteam.github.io/lesan/].

Please use the atomic development process to develop this project. You can find its structure in this path: `src/components`

Please strictly follow and use clean code and clean architecture and programming best practices and principles, try to avoid complex code.

Clean up any unnecessary code, such as console.log or unused variables or any other not used statements, and ensure state management is efficient and leak-free.

If you want to use any package please review `package.json` to see what kind of package are available.

I copied the structure of this project from another project that has nothing to do with this project, so if you see a file or component somewhere that is not very relevant to the project, you can simply delete that file.

## Important Backend Integration Notes

1. **Backend Authentication Header Format**:
   - The backend expects the JWT token in a header field called `token`
   - The token should be sent without the `Bearer` prefix
   - Example: `token: "actual-jwt-token-value"` rather than `authorization: "Bearer actual-jwt-token-value"`

2. **API Call Structure for Lesan Framework**:
   - When making API calls to the backend via the `AppApi` service, make sure to include the authentication token properly
   - The API response for `gets` (plural) operations typically includes both `data` and `metadata` fields
   - Pagination responses include: `data` array with the actual records and `metadata` with pagination info like `pageCount`, `total`, etc.
   - For operations that don't require pagination, the response may be directly the requested data

3. **Authentication Token Handling**:
   - Tokens are stored in cookies under the key "token"
   - When using the `AppApi` service, pass the token using the second parameter: `AppApi(undefined, token)`
   - The `AppApi` service now handles proper token formatting for backend compatibility

4. **Type Safety Considerations**:
   - When making API calls, the `get` parameter in the request only specifies the fields to return, not the response structure
   - Response structure is determined by the backend and may include additional fields like `metadata` for pagination

5. **Using Declared Types for Consistency**:
   - Always use the type definitions from the declarations file (e.g. `src/types/declarations/selectInp.ts`) rather than creating custom interfaces
   - Import and use the exact backend schema types (e.g. `eventSchema`, `placeSchema`, `userSchema`) to ensure consistency with the backend
   - This prevents synchronization issues and ensures type safety between frontend and backend
   - Example: Use `import { eventSchema } from "@/types/declarations/selectInp";` and then `type Event = eventSchema;`

6. **User Access Levels**:
   - The application has different user levels with increasing permissions: Normal, Editor, Manager, and Ghost
   - The Ghost user level is the highest access level with permissions to perform all administrative tasks
   - When implementing access controls, ensure Ghost users have access to all features by including `userLevel === "Ghost"` in permission checks
   - Example: `(userLevel === "Manager" || userLevel === "Editor" || userLevel === "Ghost")` when allowing access to admin features

7. **Date and Time Picker Component**:
   - The application uses a custom `DateInput` component based on `react-multi-date-picker` for all date picking needs
   - The `DateInput` component is located in `/src/components/atoms/DateInput.tsx` and follows atomic design principles
   - It supports both Persian and English locales with proper calendar systems
   - The component is fully integrated with react-hook-form using Controller
   - It supports multiple modes: single date, range selection, and multiple date selection
   - When implementing new forms that require date input, use the existing `DateInput` component rather than creating new date pickers
   - Example usage: `<DateInput name="birth_date" control={control} label="تاریخ تولد" locale="fa" format="YYYY/MM/DD" />`
   - If you need to import locale-specific date functions, use `gregorian_fa` and `gregorian_en` from `react-date-object/locales`

8. **API Operation Standards**:
   - Pay attention to the correct API operation names: use `getUsers` specifically when fetching user data, not `gets`
   - For fetching collections like places and tags, use `gets` operation
   - Note that `getUsers` and similar operations return only the data array without metadata, while `gets` operations return both data and metadata
   - When making API calls, only request the metadata fields when actually needed to improve performance
   - Follow the project standard of using the proper act types based on the specific resource and operation needed

9. **Project Standard Components**:
   - Use `DateInput` component for all date and time inputs
   - Use `MyInput` component for all standard input fields
   - Use `SelectBox` component for dropdown selections
   - Use `UploadImage` component for image upload functionality
   - Use `MyAsyncMultiSelect` component for async multiselect fields
   - For color selection, use the standardized color picker with both preset options and custom color picker as implemented in CreateUpdateModal
   - For icon selection, use the standardized icon picker with both preset options and custom text input as implemented in CreateUpdateModal
   - When building forms, follow the structure seen in `FormCreateUser.tsx` for consistency
   - All forms should utilize react-hook-form for state management and validation
   - Use Zod for form validation schemas to ensure type safety and proper validation

10. **Development Workflow**:
    - When I give a new prompt during development, I usually run the project myself. You don't need to run the project again to find errors. In fact, I usually check the project myself after the changes you make and if there are any errors, I will give you the new prompt again.
