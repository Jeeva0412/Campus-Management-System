# Phase 10: Jira / Scrum Simulation

## Workflow States
`TO DO` → `IN PROGRESS` → `TESTING` → `DONE`

## Sprint 1: Core Foundation & Security
**Sprint Goal:** Deliver a secure authentication mechanism, strict RBAC foundation, and basic club/membership discovery.

### Sprint 1 Backlog
- **Task 1:** Set up FastAPI and PostgreSQL database schemas. (Status: DONE)
- **Task 2:** Implement JWT Authentication with secure HttpOnly cookies. (Status: DONE)
- **Task 3:** Implement RBAC Middleware for role separation. (Status: DONE)
- **Task 4:** Create "View Clubs" API and UI. (Status: DONE)
- **Task 5:** Implement Student Membership joining logic. (Status: DONE)
- **Bug 1:** JWT token not expiring correctly. (Status: DONE, Fixed)

### Sprint 1 Metrics
- **Velocity:** 35 Story Points completed.
- **Carry-over:** 0 Story Points.

## Sprint 2: Events, Authorization, and DevSecOps
**Sprint Goal:** Implement event management with strict IDOR protections and finalize DevSecOps pipelines.

### Sprint 2 Backlog
- **Task 6:** Create Event Management APIs. (Status: DONE)
- **Task 7:** Implement IDOR Protection (`verifyEventOwnership`). (Status: DONE)
- **Task 8:** Event Registration API with capacity locks. (Status: TESTING)
- **Task 9:** Admin Dashboard for role/user management. (Status: IN PROGRESS)
- **Task 10:** Set up GitHub Actions CI/CD with Semgrep. (Status: DONE)

### Scrum Ceremonies
- **Daily Scrum:** Conducted daily; identified a blocker during Task 7 where Coordinators were mistakenly granted access to all events due to a flawed SQL join.
- **Sprint Review:** Demonstrated a successful login, role-based UI rendering, and a simulated IDOR attack failing against the API.
- **Retrospective:** Recognized that early threat modeling prevented major architectural rewrites in Sprint 2. Noted that UI development needs more parallelization.
