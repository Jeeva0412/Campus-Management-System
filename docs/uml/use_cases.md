# Phase 3: UML and Requirements Analysis

## Use Case Diagram

```mermaid
usecaseDiagram
    actor Student
    actor Coordinator
    actor Administrator

    Student --> (Authenticate)
    Student --> (View Clubs)
    Student --> (Join Club)
    Student --> (View Events)
    Student --> (Register for Event)
    Student --> (View Announcements)

    Coordinator --> (Authenticate)
    Coordinator --> (View Assigned Clubs)
    Coordinator --> (Create Event)
    Coordinator --> (Manage Event)
    Coordinator --> (Manage Members)
    Coordinator --> (Publish Announcement)

    Administrator --> (Authenticate)
    Administrator --> (Manage Clubs)
    Administrator --> (Manage Users)
    Administrator --> (Assign Coordinator)

    (Join Club) .> (Authenticate) : include
    (Create Event) .> (Authenticate) : include
    (Register for Event) .> (Authenticate) : include
    (Register for Event) .> (Join Club) : extend
```

## Detailed Use Case Specifications

### UC-01 — Register for Event
- **Actor:** Student
- **Preconditions:**
  - The Student is authenticated.
  - The Student is a member of the club hosting the event.
  - The event registration is open and not full.
- **Main Flow:**
  1. Student selects an upcoming event from the club page.
  2. Student clicks "Register".
  3. System verifies student membership and event capacity.
  4. System records the registration.
  5. System returns a success confirmation.
- **Alternative Flow:**
  - If the student is already registered, the system displays an "Already Registered" message.
- **Exception Flow:**
  - If the event is full, the system displays an "Event Full" error.
  - If the student is not a member of the club, the system prompts them to join the club first.
- **Postconditions:** Student is successfully registered for the event.

### UC-02 — Coordinator Modifies Event (Security-Focused)
- **Actor:** Coordinator
- **Preconditions:**
  - Coordinator is authenticated.
  - The Event exists.
- **Main Flow:**
  1. Coordinator sends a request to modify an event (e.g., `PATCH /api/events/{eventId}`).
  2. System authenticates the user.
  3. System verifies the user's role is `COORDINATOR`.
  4. System fetches the event to identify its associated club.
  5. System queries the authorization layer to check if the Coordinator is assigned to that specific club.
  6. Authorization succeeds. System processes the event modification.
  7. System logs the action and returns a success response.
- **Exception Flow (Authorization Failure):**
  - If the Coordinator is NOT assigned to the event's club (e.g., attempting IDOR), the authorization layer rejects the request.
  - System logs an unauthorized modification attempt.
  - System returns a `403 Forbidden` response.

## Scenario-Based Analysis Model: "Student Joins Club and Registers for Event"
1. **Trigger:** Student discovers a new club ("Cyber Security Club") they want to participate in.
2. **Action 1 (Join):** Student requests to join. The API verifies they are not already a member and creates a `Membership` record.
3. **Action 2 (Discover):** Student views the club's events and sees "Capture The Flag 2026".
4. **Action 3 (Register):** Student registers for the event. The backend validates the newly created `Membership` and secures a spot in `EventRegistration`.
5. **Outcome:** Student data is updated securely, avoiding any exposure of other students' data during the process.
