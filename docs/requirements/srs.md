# Phase 2: Software Requirements Specification (SRS)

## 1. Introduction
This document specifies the requirements for the NexusClubs (Campus Pass Ecosystem).

## 2. Stakeholders
- **Student:** Primary end-user who explores clubs and attends events.
- **Club Coordinator:** Manages assigned clubs, members, and events.
- **Administrator:** Oversees platform operations, manages clubs, users, and roles.
- **College/Institution Management:** Needs assurance that student data is protected and activities are auditable.

## 3. Requirements Categorization

### 3.1 Functional Requirements (FR)
- **FR-01 (Authentication):** The system shall allow users to register and login using their college credentials.
- **FR-02 (Club Discovery):** Students shall be able to view, search, and filter available college clubs.
- **FR-03 (Club Membership):** Students shall be able to join and leave clubs.
- **FR-04 (Event Registration):** Students shall be able to register for events and cancel their registrations.
- **FR-05 (Event Management):** Coordinators shall be able to create, edit, and delete events for their assigned clubs.
- **FR-06 (Member Management):** Coordinators shall be able to view and manage members within their assigned clubs.
- **FR-07 (Announcement Management):** Coordinators shall be able to publish and edit announcements for their clubs.
- **FR-08 (Administrator Management):** Administrators shall be able to create, edit, deactivate clubs, and manage users/roles.

### 3.2 Non-Functional Requirements (NFR)
- **NFR-01 (Responsiveness):** The UI must be responsive and support screen sizes from 375px up to 1920px without horizontal overflow.
- **NFR-02 (Performance):** API responses must return within 200ms under normal load.
- **NFR-03 (Usability):** The interface must utilize the 'Campus Pass' design language, emphasizing physical metaphors like Ticket stubs, ID badges, and ink/paper aesthetics without relying on generic AI design tropes like glassmorphism.
- **NFR-04 (Maintainability):** The backend must use a modular layered architecture to ease future modifications.

### 3.3 Security Requirements (SEC)
- **SEC-01 (Authentication):** Passwords must be securely hashed (e.g., using bcrypt) and not stored in plaintext. (Maps to: Authentication, Confidentiality)
- **SEC-02 (Event Authorization):** Coordinators must only be able to modify events belonging to clubs they manage. (Maps to: Authorization, Integrity)
- **SEC-03 (Member Data Protection):** Coordinators can only view member details of students in their assigned clubs. (Maps to: Confidentiality, Authorization)
- **SEC-04 (Privilege Escalation Prevention):** Users cannot modify their own roles or privileges; all authorization-sensitive fields must be validated server-side. (Maps to: Authorization, Integrity)
- **SEC-05 (Audit Logging):** Security-relevant actions (login failures, role changes, event deletions) must be logged securely. (Maps to: Auditability)
- **SEC-06 (Input Validation):** All inputs must be strictly validated to prevent injection and fuzzing attacks. (Maps to: Integrity, Availability)

## 4. Prioritization
1. **Critical:** FR-01, SEC-01, SEC-02, SEC-04, FR-05
2. **High:** FR-02, FR-03, FR-04, SEC-03, SEC-06, NFR-01
3. **Medium:** FR-06, FR-07, FR-08, SEC-05
4. **Low:** NFR-02, NFR-04
