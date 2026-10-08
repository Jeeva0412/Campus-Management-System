# Phase 4: ER Model and DFD

## Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ MEMBERSHIP : has
    USER ||--o{ EVENT_REGISTRATION : registers
    USER ||--o{ CLUB_COORDINATOR : acts_as
    USER ||--o{ AUDIT_LOG : generates

    CLUB ||--o{ MEMBERSHIP : includes
    CLUB ||--o{ EVENT : hosts
    CLUB ||--o{ ANNOUNCEMENT : broadcasts
    CLUB ||--o{ CLUB_COORDINATOR : managed_by

    EVENT ||--o{ EVENT_REGISTRATION : contains

    USER {
        int id PK
        string email
        string password_hash
        string role
        string full_name
    }

    CLUB {
        int id PK
        string name
        string description
        boolean is_active
    }

    CLUB_COORDINATOR {
        int user_id FK
        int club_id FK
    }

    MEMBERSHIP {
        int user_id FK
        int club_id FK
        datetime joined_at
    }

    EVENT {
        int id PK
        int club_id FK
        string title
        string description
        datetime start_time
        int capacity
    }

    EVENT_REGISTRATION {
        int user_id FK
        int event_id FK
        datetime registered_at
    }

    ANNOUNCEMENT {
        int id PK
        int club_id FK
        string content
        datetime posted_at
    }

    AUDIT_LOG {
        int id PK
        int user_id FK
        string action
        string resource
        datetime timestamp
    }
```

## Level-0 DFD (Context Diagram)

```mermaid
flowchart TD
    S([Student])
    C([Coordinator])
    A([Administrator])
    
    SYS[College Club Management System]

    S -->|View Clubs, Register Event| SYS
    SYS -->|Event Details, Confirmation| S

    C -->|Manage Events, Announcements| SYS
    SYS -->|Member Data, Status| C

    A -->|Manage Clubs, Roles| SYS
    SYS -->|System Status, Audit Logs| A
```

## Level-1 DFD

```mermaid
flowchart TD
    %% External Entities
    S([Student])
    C([Coordinator])
    A([Administrator])

    %% Trust Boundaries
    subgraph "Trust Boundary: Client / Internet"
        S
        C
        A
    end

    subgraph "Trust Boundary: Backend API & Authorization Layer"
        P1((1.0 Auth & Authz))
        P2((2.0 Club Management))
        P3((3.0 Event Management))
        P4((4.0 Admin Operations))
    end

    %% Data Stores
    D1[(D1: Users DB)]
    D2[(D2: Clubs & Members DB)]
    D3[(D3: Events DB)]
    D4[(D4: Audit DB)]

    %% Flows
    S -->|Login Credentials| P1
    C -->|Login Credentials| P1
    A -->|Login Credentials| P1
    P1 <-->|Verify| D1
    P1 -->|Log Auth Action| D4

    S -->|Fetch Clubs| P2
    P2 <-->|Read| D2
    
    C -->|Create Event Data| P3
    P3 <-->|Write Event, Check Club| D3
    P3 -->|Log Event Creation| D4

    A -->|Create Club| P4
    P4 <-->|Write| D2
    P4 -->|Log Admin Action| D4
```

### Trust Boundaries
1. **Internet/User → Frontend:** Untrusted zone. Client-side input cannot be trusted.
2. **Frontend → Backend API:** The primary trust boundary where authentication and payload validation occurs.
3. **Privileged API → Authorization Layer:** Operations requiring elevated privileges (Coordinator, Admin) must pass through strict server-side RBAC before touching the database.
4. **Backend API → Database:** Trusted zone, but requires defense-in-depth (least privilege DB accounts).
