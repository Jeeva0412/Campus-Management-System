# Phase 9: Product Backlog

## Epics
- EPIC-01 Authentication
- EPIC-02 Club Management
- EPIC-03 Membership
- EPIC-04 Events
- EPIC-05 Announcements
- EPIC-06 Administration
- EPIC-07 Security
- EPIC-08 DevSecOps

## User Stories

| Story ID | Epic | Priority | User Story | Acceptance Criteria |
|---|---|---|---|---|
| US-01 | EPIC-01 | High | As a student, I want to securely log in so that I can access club features. | - Accepts valid college email/password.<br>- Returns secure HttpOnly JWT.<br>- Fails gracefully on invalid credentials. |
| US-02 | EPIC-02 | High | As a student, I want to view available clubs so that I can discover clubs to join. | - Shows a responsive list of active clubs.<br>- Does not expose private club data. |
| US-03 | EPIC-03 | High | As a student, I want to join a club so that I can participate in its events. | - Creates membership record.<br>- Cannot join deactivated clubs. |
| US-04 | EPIC-04 | High | As a student, I want to register for an event so that I can attend it. | - Checks if student is a club member.<br>- Verifies capacity.<br>- Prevents duplicate registrations. |
| US-05 | EPIC-04 | High | As a coordinator, I want to create events for my assigned club so that members can register. | - Restricts creation to assigned clubs only.<br>- Validates date/capacity inputs. |
| US-06 | EPIC-07 | Critical | As a security engineer, I want the system to enforce strict RBAC so that users cannot perform unauthorized actions. | - Role checks on all protected API routes.<br>- Automated tests prove 403 on violations. |
| US-07 | EPIC-07 | Critical | As a security engineer, I want to prevent IDOR on event modification so that coordinators cannot alter other clubs' events. | - `verifyEventOwnership` middleware implemented.<br>- Attempting IDOR returns 403 and is logged. |
| US-08 | EPIC-03 | High | As a coordinator, I want to view members of my club so that I can manage them. | - Only returns members of the assigned club.<br>- Excludes sensitive fields (e.g., password hashes). |
| US-09 | EPIC-06 | Medium | As an administrator, I want to assign coordinators to clubs so that they can manage operations. | - Admin-only endpoint.<br>- Successfully updates `CLUB_COORDINATOR` table. |
| US-10 | EPIC-08 | High | As a DevSecOps engineer, I want a CI/CD pipeline so that code is automatically tested and scanned for vulnerabilities before deployment. | - GitHub Actions configured.<br>- SAST (Semgrep) blocks failing builds.<br>- Docker image builds successfully. |
