# Phase 5: Software Architecture

## Layered Architecture / Modular Monolith
The system utilizes a clean Layered Architecture (Modular Monolith) to enforce separation of concerns, improve testability, and isolate security boundaries.

### Architectural Structure
```text
[ Frontend ] (React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion)
      ↓ (HTTPS / REST API)
[ API Layer ] (FastAPI Controllers, Request Validation)
      ↓
[ Authentication & Authorization ] (JWT, RBAC Middleware)
      ↓
[ Service Layer ] (Business Logic, Core Rules)
      ↓
[ Repository / Data Access ] (SQLAlchemy ORM)
      ↓
[ Database ] (PostgreSQL)
```

## Major Components
1. **Authentication Service:** Handles login, JWT generation, and password hashing.
2. **Authorization Service:** Centralized RBAC and resource ownership checks (e.g., verifying if a Coordinator owns the club associated with an event).
3. **Club Service:** Manages club metadata and lifecycle.
4. **Membership Service:** Handles student join/leave operations and enforces cross-club data privacy.
5. **Event Service:** Manages event CRUD operations. Interacts heavily with the Authorization Layer.
6. **Registration Service:** Manages event capacities and student registrations.
7. **Announcement Service:** Manages broadcasts to club members.
8. **User Management Service:** Admin-only service for role assignments.
9. **Audit Service:** Logs sensitive operations.

## Design Patterns Applied
1. **Layered Architecture:** Segregates UI, API, Business Logic, and Data.
2. **Repository Pattern:** Abstracts database queries behind a repository interface, ensuring the Service Layer does not contain SQL/ORM specific code.
3. **Service Layer Pattern:** Encapsulates business logic. Controllers only handle HTTP translation and delegate to Services.
4. **Middleware / Interceptor Pattern:** Used for Authentication and Authorization. Every request passes through a dependency injection pipeline that enforces security before reaching the controller.
5. **DTO (Data Transfer Object) Pattern:** Uses Pydantic models to strictly validate incoming payloads and shape outgoing data, preventing over-posting and sensitive data exposure.
