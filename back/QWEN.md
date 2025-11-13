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

## Lesan Framework Complete Documentation

### Core Concepts

Lesan is a web server and ODM (Object Document Model) framework designed to implement microservices with a focus on performance and data management. The core concepts include:

1. **Delegated Data Retrieval**: Inspired by GraphQL, Lesan delegates data retrieval management to the client without adding extra layers like GQL language processors.

2. **NoSQL Capabilities**: Leverages all capabilities of NoSQL databases to embed relationships within schemas without requiring server-side programmers to manage embeddings.

3. **Regular Structure for Validation**: Maintains a structured approach similar to SQL for data models in the ODM layer to ensure data validation.

4. **Advanced Relationship Management**: Provides a new definition for creating relationships between data, allowing full control over their details.

5. **Movable Data Structure**: Enables the data structure to move along with server-side functions for easier microservice management.

### Microservices Architecture

#### Traditional Challenges and Lesan Solution

**Challenges in Traditional Microservices:**

- Model consistency across services
- Data consistency when services fail to communicate
- Complex hardware resource distribution
- Difficult horizontal scaling

**Lesan's Solution:**

- Provides "small solutions for implementation of microservices that can reduce their implementation complexity"
- Proposes a new architecture that sits between microservices and monoliths
- Uses a unified database model with service-specific validation
- Eliminates data duplication and synchronization needs

**Unified Database Approach:**

- Create a comprehensive database with all possible models and fields
- Each service validates only the data relevant to it
- Services can share the same comprehensive model while working with only required fields
- Prevents data duplication and eliminates need for synchronization tools

### Function Structure

#### Main Components:

- **schemas**: Contains schema functions (getSchemas, getPureOfMainRelations, getSchema, etc.)
- **acts**: Action functions (setAct, getServiceKeys, getActs, etc.)
- **odm**: Object Document Model functions (setDb, getCollection, newModel, etc.)
- **contextFns**: Context management functions (getContextModel, setContext, addContext, etc.)

#### Key Functions:

- **setAct**: Used to register actions that define the API endpoints
- **newModel**: Creates a new data model with associated CRUD operations
- **addRelation** / **removeRelation**: Functions for managing relationships between data
- **find** / **findOne**: Functions for querying data with flexible projection
- **insertOne** / **insertMany**: Functions for creating new records
- **findOneAndUpdate**: Updates a single record based on criteria
- **deleteOne**: Deletes a single record
- **countDocument**: Counts documents matching specified criteria

### Validation Patterns

1. **Schema-based Validation**: Uses a structured schema approach with `set` and `get` objects:
   - `set`: Contains input parameters for the function
   - `get`: Defines the projection structure using `selectStruct`

2. **Type Safety**: Supports TypeScript with strong type definitions throughout the framework.

3. **Superstruct Validation**: Implements validation syntax using Superstruct for schema definitions.

4. **Relationship Validation**: Provides mechanisms to validate relationships between different data models.

5. **Depth Penetration Validation**: The `selectStruct` function dynamically generates validation schemas based on model and desired depth, with two parameters:
   - Model name for which to generate the validation object
   - Depth of penetration (number or object)

6. **Application-level Filters**: Validators should use application-level filtering parameters rather than exposing database-specific operators (e.g., avoid $gte, $lte, $regex in validators). Instead of accepting MongoDB operators directly from frontend, create application-specific parameters that are transformed into appropriate database queries internally. This approach provides better security and abstraction.

7. **Typed Relations**: When working with relationships, use `TInsertRelations<typeof model_relations>` to ensure type safety when defining relations in functions like `insertOne`. This provides compile-time validation of relation fields and helps prevent runtime errors.

8. **Relationship Replace Option**: The `replace` option in `addRelation` should be used with caution. When true, it deletes all existing relationships and replaces them with new ones, affecting all embedded relationships. For single-type relations, if `replace` is false and a relation already exists, an error occurs; if true, replacement occurs. For multiple-type relations, if `replace` is false, new documents are added to existing relations; if true, all existing relations are replaced. Always consider the implications before using `replace: true`.

### Request Flow and HTTP Methods

#### Supported HTTP Methods:

- **GET**: Two models supported:
  - Static document requests (requires `staticPath` configuration in `runServer`)
  - Playground access requests (requires `playground: true` in `runServer`)
- **POST**: Two models supported:
  - Data retrieval requests with JSON body containing service, model, act, and details
  - Document upload requests following standard file upload protocols

#### POST Request Structure:

- **service**: Selects microservice (defaults to "main")
- **model**: Selects data model
- **act**: Selects action
- **details**: Contains data and selection criteria
  - `set`: Information needed in Act function
  - `get`: Selected information to return (MongoDB projection format)

### Relationship Management

#### Types of Relationships:

- **relation**: Defines relationships from the parent document to other documents
- **relatedRelations**: Defines the reverse relationships that get created on the target model

#### Relationship Types:

1. **Single Relations**: Defined with `type: "single"` as `RelationDataType`
2. **Multiple Relations**: Defined with `type: "multiple"` as `RelationDataType`
3. **Embedded Relations**: Store related data directly within parent document

#### Core Relationship Properties:

- **optional**: Whether the relationship is required or optional
- **schemaName**: The name of the schema this relationship connects to
- **type**: The relationship type ("single" or "multiple")
- **relatedRelations**: Defines the reverse relationships that get created on the target model
- **limit**: For multiple relations, limits the number of embedded documents
- **sort**: Defines sorting for embedded multiple relations
- **excludes**: Specifies which fields to exclude from the related data when projecting

#### Managing Relations:

- **addRelation Function**: Used instead of manual updates to add relationships between documents
- **removeRelation Function**: Used instead of manual updates to remove relationships between documents
- **Important**: Never manually update relationships with update or updateMany functions

#### addRelation Function Parameters:

- **filters**: MongoDB findOne filter to find the document to change
- **relations**: Object describing the relations to establish
- **projection**: Specifies which fields to return after relation is added
- **replace** (optional): When true, deletes existing relationships and replaces them with new ones (affects all embedded relationships). For single relationships, if replace is false and a relationship already exists, an error occurs; if true, the replacement occurs. For multiple relationships, if replace is false, new documents are added to existing relationships; if true, all existing relations are replaced. Use with caution as it affects all embedded relationships.

**Usage Pattern**: When designing your API, separate document property updates from relationship updates. Use findOneAndUpdate for document properties and addRelation/removeRelation specifically for managing relationships. This separation ensures data integrity and proper handling of relation cascades.

#### removeRelation Function Parameters:

- **filters**: MongoDB findOne filter to find the document to change
- **relations**: Object specifying which relationships to remove
- **projection**: Specifies which fields to return after relation is removed

### Function Implementation Patterns

#### Add Function Pattern:

```typescript
const addEntityValidator = () => {
  return object({
    set: object({
      ...pureFields,
      relationField: objectIdValidation, // for single relations
      // or relationField: array(objectIdValidation) for multiple
    }),
    get: coreApp.schemas.selectStruct("entity", 1),
  });
};

const addEntity: ActFn = async (body) => {
  const { relationField, ...otherFields } = body.details.set;

  return await model.insertOne({
    doc: { ...otherFields },
    projection: body.details.get,
    relations: {
      relationField: {
        _ids: [new ObjectId(relationField)], // Always use arrays
        relatedRelations: {
          reverseRelation: true, // or false depending on requirements
        },
      },
    },
  });
};
```

#### Get Function Pattern:

```typescript
const getEntityValidator = () => {
  return object({
    set: object({
      entityId: objectIdValidation, // Input parameters
    }),
    get: coreApp.schemas.selectStruct("entity", 1), // Projection structure
  });
};

const getEntity: ActFn = async (body) => {
  const {
    set: { entityId },
    get,
  } = body.details;

  return await model.findOne({
    filters: { _id: new ObjectId(entityId) }, // Match/filters parameter
    projection: get, // Get/projection parameter
  });
};
```

#### Gets Function Pattern:

```typescript
const getEntitiesValidator = () => {
  return object({
    set: object({
      page: number().optional().default(1), // Pagination parameters
      limit: number().optional().default(50),
      skip: number().optional(),
      // Additional filter parameters as needed
    }),
    get: coreApp.schemas.selectStruct("entity", 1), // Projection
  });
};

const getEntities: ActFn = async (body) => {
  let {
    set: { page, limit, skip },
    get,
  } = body.details;

  skip = skip || limit * (page - 1);

  return await model
    .find({
      filters: {}, // Match/filters parameter
      projection: get, // Get/projection parameter
    })
    .skip(skip) // Skip parameter
    .limit(limit) // Limit parameter
    .toArray();
};
```

#### find and findOne Functions

**Parameters:**

- **filters**: MongoDB query operation to filter documents
- **projection**: MongoDB projection operation to specify which fields to return
- **options** (optional): MongoDB findOptions for additional configuration

**Key Features:**

- findOne retrieves a single document based on provided filters
- find retrieves multiple documents based on provided filters
- Both support relationship embedding through projection
- Both allow specifying depth of relationships to include
- find supports pagination when combined with .skip() and .limit() methods

#### Aggregation Functions

**Parameters:**

- **pipeline**: An array of MongoDB aggregation pipeline stages
- **projection**: Defines the fields to be returned in the response, including related data

**Usage:**

- Used when penetrating more than one step in relationship depths
- Relationship penetration is always one step behind the client request
- Can be used instead of find and findOne
- Automatically creates lookup, unwind and projection pipelines based on client's get input

### Update and Delete Operations

#### findOneAndUpdate Function

**Parameters:**

- **filter**: Defines which document to update (MongoDB filter)
- **projection**: Specifies which fields to return
- **update**: Defines how to update the document (MongoDB update operators)

**Important Note**: The findOneAndUpdate function should be used only for updating document properties, not relationships. For updating relationships, use addRelation and removeRelation functions.

**Complex Update Scenarios:**

- QQ (Query Queue): Queue of commands for chunking millions of updates
- In-Memory Database: Track changes to sent information in RAM
- Make New Relation: Convert frequently changing fields into new schemas with relationships

#### deleteOne Function

**Parameters:**

- **filter**: (Required) MongoDB filter object to specify which document to delete
- **hardCascade**: (Optional) Boolean value to enable recursive deletion of related documents
- **get**: (Optional) Object to specify which fields to return after deletion

**Features:**

- Automatically checks for related documents before deletion
- Prevents deletion with error message if related documents would become meaningless
- Supports hard cascade deletion for recursive deletion of dependent documents

#### countDocument Function

**Parameters:**

- **filter**: (Required) MongoDB filter object to specify which documents to count

**Features:**

- Returns the number of documents that match the provided filter
- Efficiently counts documents without returning the actual documents

#### insertMany Function

**Parameters:**

- **docs**: An array of document objects to be inserted
- **projection**: Specifies which fields to return in the result
- **relations**: An object defining relationships to establish with other documents

**Features:**

- Validates all input data before execution
- Handles all types of relationships: one-to-many, many-to-many, and one-to-one
- All changes are sent to the database using an aggregation pipeline
- Significantly faster than other platforms for large data insertions

### Depth Penetration

The server-side programmer must determine the depth of relationships for each accessible endpoint before writing the accessible point. This prevents unbounded queries that could impact performance.

When using selectStruct with a number, it applies that depth to all relationships in the model. When using an object, you can specify different depths for different relationships.

### Queuing Data Changes (QQ System)

The QQ (Query Queue) system addresses the challenge of repeated data updates:

- Manages large numbers of updates by dividing them into smaller, processable parts
- Monitors server resources and sends small parts for updating based on available resources
- Reduces request count by comparing and merging similar requests
- Can verify consistency of repeated data and find/correct problems
- Supports AI integration for managing changes in the queue

### Playground Features

The interactive playground provides:

- Tabs for multiple simultaneous tasks
- Service, schema, and action selectors
- Set and get fields sections
- Response section with status indicators
- Settings for custom URLs and headers
- History of requests and responses
- E2E testing capabilities with sequence management
- Schema and act documentation
- Performance metrics

### Performance Conclusion

According to the documentation's benchmarks, Lesan significantly outperforms other frameworks:

- 1168% faster than Prisma-Express-REST (PostgreSQL)
- 1417% faster than Prisma-Express-GraphQL (PostgreSQL)
- 4435% faster than Mongoose-Express-REST (without sorting)
- 72289% faster than MongoDB-Express-REST (without sorting)
- 298971% faster than Mongoose-Express-REST (with sorting)

The trade-off is a minimal performance impact on create, update, and delete operations for significantly faster data retrieval, making it ideal for read-heavy applications.

### Philosophy

Lesan's core philosophy centers on simplifying the client-server communication process, maximizing NoSQL database capabilities, and enabling scalable microservice architectures. It focuses on performance by embedding relationships within documents, reducing the number of database queries needed for complex data retrieval operations. The framework addresses traditional challenges with GraphQL and SQL by providing database-optimized filtering and embedded relationships that maintain efficiency even with deep nested data access patterns.
