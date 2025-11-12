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
- The application supports Persian (fa) and English (en) locales
- Uses next-intl for internationalization
- Translation files are located in the `/messages` directory
- Direction changes automatically based on locale (RTL for Persian, LTR for English)

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