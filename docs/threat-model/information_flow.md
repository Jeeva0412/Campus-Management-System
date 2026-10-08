# Information Flow Analysis

## Asset 1: Student Personal Data
**Flow Trace:**
1. **Source:** Student inputs data on Frontend Registration Form.
2. **Processing:** Frontend sends JSON to API; API validates payload.
3. **Transmission:** Over HTTPS (TLS 1.2+) to Backend.
4. **Storage:** Encrypted at rest in PostgreSQL DB.
5. **Access:** Queried by Coordinator API when viewing members.
6. **Output:** Returned to authorized Coordinator's UI.

**Security Controls:**
- TLS in transit.
- Authorization middleware restricts query output based on Coordinator's assigned clubs.

## Asset 2: Coordinator/Admin Privileges (JWT Tokens)
**Flow Trace:**
1. **Source:** Authentication Service issues JWT upon valid login.
2. **Processing:** JWT generated with `role` and `club_ids` claims.
3. **Transmission:** Sent to Client as an HttpOnly secure cookie.
4. **Storage:** Stored in browser cookie (never accessible to JS).
5. **Access:** Sent with every protected API request.
6. **Output:** Backend Authorization layer decodes and validates signature to grant access.

**Security Controls:**
- Strong JWT secret stored in environment variables.
- HttpOnly flag prevents XSS theft.
- Token expiration (short-lived).

## Asset 3: Event Data & Modifications
**Flow Trace:**
1. **Source:** Coordinator modifies event via Frontend.
2. **Processing:** Backend receives `PATCH /api/events/{id}`.
3. **Transmission:** Over HTTPS.
4. **Storage:** Stored in `EVENT` table in Database.
5. **Access:** Backend checks Ownership: `Does Coordinator own Event.Club_ID?`
6. **Output:** Success confirmation or `403 Forbidden`.

**Security Controls:**
- Strict server-side verification of resource ownership (IDOR prevention).
