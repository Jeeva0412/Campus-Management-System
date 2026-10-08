# Phase 8: Attack Tree

## Root Goal: Modify Event Belonging to Another Club

```mermaid
graph TD
    Root["Goal: Modify Event Belonging to Another Club"]
    
    %% Main Branches (OR)
    Root --> StealCreds["OR: Steal/Abuse Coordinator Credentials"]
    Root --> BypassAuthz["OR: Bypass Authorization (IDOR)"]
    Root --> EscalatePriv["OR: Escalate Privileges"]
    
    %% Steal Credentials Path
    StealCreds --> Phishing["AND: Phish Coordinator"]
    StealCreds --> SessionHijack["AND: XSS Session Hijacking"]
    
    %% Bypass Authorization Path (Highest Risk)
    BypassAuthz --> FindID["AND: Enumerate Target Event ID"]
    BypassAuthz --> SendPatch["AND: Send PATCH request with Target ID"]
    SendPatch --> MissingCheck["AND: Exploiting Missing Ownership Check on Server"]
    
    %% Escalate Privileges Path
    EscalatePriv --> InjectRole["AND: Inject 'role=ADMIN' in User Update payload"]
    EscalatePriv --> DBInjection["AND: SQL Injection to modify user role"]
    
    %% Controls (Visualized as mitigation blocks)
    style MissingCheck fill:#ffcccc,stroke:#ff0000
    style BypassAuthz stroke:#ff0000,stroke-width:2px
```

## Attack Paths and Controls

### 1. Bypass Authorization (IDOR) - Highest Risk
- **Path:** Attacker authenticates as a legitimate Coordinator. Attacker views the public Event list, notes the `event_id` of another club. Attacker sends an API request directly to modify that `event_id`.
- **Vulnerability:** Server checks if the user is a Coordinator but fails to check if the Coordinator is assigned to the Club that owns the Event.
- **Preventive Control:** Centralized Ownership Authorization Middleware (`verifyEventOwnership`).
- **Detective Control:** Audit log monitoring for unauthorized `403` attempts.

### 2. Privilege Escalation
- **Path:** Attacker exploits a weak Profile Update API endpoint to modify their role to `ADMIN`.
- **Preventive Control:** Strict DTO input validation; ignoring `role` fields in user-facing endpoints.

### 3. Session Hijacking
- **Path:** Attacker steals a JWT.
- **Preventive Control:** Use HttpOnly, Secure cookies for JWT transmission.
