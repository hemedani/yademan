# Naghshe Backend - Deno Application

## Project Overview

The Naghshe backend is a full-stack application built with Deno using the Lesan framework. This is a geographic information system focused on managing places and locations, with features for managing categories, cities, provinces, zones, places, comments, tags, and virtual tours. The project has evolved from an initial concept as a traffic accident management system (as indicated in Models.md) to a more general location management platform.

### Architecture
- **Backend Framework**: Lesan (MongoDB-based ODM/ORM framework for Deno)
- **Runtime**: Deno
- **Database**: MongoDB
- **File Storage**: Static file uploads managed through the backend
- **API**: REST/GraphQL API with automatic playground generation
- **Authentication**: JWT-based with jose library

### Core Technologies
- **Backend Runtime**: Deno
- **Framework**: Lesan (v0.1.22)
- **Database**: MongoDB (with GeoJSON support)
- **Authentication**: djwt library
- **Containerization**: Docker

## Key Features

### Backend (Lesan Framework)
- Schema-based data modeling with validation
- Automatic API generation with playground interface
- MongoDB ODM with relationship management and GeoJSON support
- CORS support for frontend integration
- File upload functionality with static file serving
- Type generation for frontend integration

### Data Models
The backend defines the following core models:
- Users - User authentication and authorization
- Files - File upload management
- Places - Location-based entities with GeoJSON support
- Categories - Categorization system
- Provinces/Cities/City Zones - Geographic hierarchy
- Comments - User feedback and reviews
- Tags - Metadata categorization
- Virtual Tours - 360-degree tour functionality

## Project Structure

```
naghshe/back/
├── deno.json               # Deno project configuration
├── deps.ts                 # Dependency imports
├── mod.ts                  # Main application entry point
├── Dockerfile              # Multi-stage Docker configuration
├── Models.md               # Data models documentation
├── declarations/           # Generated type declarations
├── models/                 # Data model definitions
│   ├── utils/              # Model utilities
│   └── *.ts                # Individual model files
├── src/                    # API route and logic implementations
│   ├── mod.ts              # Functions setup module
│   └── [model_name]/       # Individual model routes and logic
├── test/                   # Test files
├── uploads/                # Static file uploads directory
└── utils/                  # Utility functions
```

## Building and Running

### Development Environment

**Deno development (with auto-reload):**
```bash
cd back/
deno task bc-dev  # Runs with auto-reload for development
```

### Production Deployment

**Docker-based Production:**
```bash
# Build production image
docker build --target production -t naghshe-backend:production .

# Or run with docker-compose (from project root)
docker-compose up --build
```

## Environment Configuration

The application uses environment variables:
- `MONGO_URI`: MongoDB connection string (defaults to "mongodb://127.0.0.1:27017/")
- `ENV`: Environment mode (development/production)
- `APP_PORT`: Application port (defaults to 1405)

## API Documentation

The backend provides an API playground accessible when the application is running, allowing for interactive API exploration and testing.

## Development Conventions

### Backend (Deno/Lesan)
- Uses Lesan framework for API generation and data modeling
- TypeScript with strict typing
- Zod-like validation syntax for schema definitions
- Auto-generated type declarations for frontend integration
- MongoDB ODM with relationship support and GeoJSON fields
- Proper file structure with models, routes, and utilities in separate directories