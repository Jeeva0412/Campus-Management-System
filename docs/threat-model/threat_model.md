# Phase 7: Threat Modeling

## Asset Inventory
| ID  | Asset | Description | CIA Classification |
|---|---|---|---|
| **A1** | User credentials | Passwords and JWT tokens | High Confidentiality, High Integrity |
| **A2** | Student personal information | Names, emails, profiles | High Confidentiality, Medium Integrity |
| **A3** | Club membership data | Who belongs to which club | Medium Confidentiality, High Integrity |
| **A4** | Event data | Titles, times, descriptions | Low Confidentiality, High Integrity |
| **A5** | Event registrations | Which students are attending | Medium Confidentiality, High Integrity |
| **A6** | Announcements | Club broadcasts | Low Confidentiality, High Integrity |
| **A7** | Administrator privileges | Admin roles/tokens | High Confidentiality, Critical Integrity |
| **A8** | Coordinator privileges | Coordinator roles/tokens | High Confidentiality, Critical Integrity |
| **A9** | Audit logs | Security event records | High Confidentiality, Critical Integrity |
| **A10** | Database | Underlying PostgreSQL storage | Critical CIA |

## STRIDE Threat Analysis

| DFD Element | Threat | STRIDE Category | Impact | Mitigation |
|---|---|---|---|---|
| Login API | Credential spoofing | Spoofing | High | Secure authentication, strong password policy. |
| Event API | Unauthorized modification of an event | Tampering | Critical | Server-side RBAC and club ownership authorization checks. |
| Member API | Cross-club member data exposure | Information Disclosure | High | Authorization middleware restricts Coordinators to their assigned clubs. |
| Admin API | Privilege escalation via role injection | Elevation of Privilege | Critical | Server-side role validation; ignore `role` in client requests. |
| Database | Unauthorized data modification | Tampering | Critical | Least privilege DB accounts; parameter validation. |
| Registration API | Event capacity overbooking | Denial of Service | Medium | Database-level transactions and locks for capacity checks. |
| Audit System | Deleting or altering audit logs | Repudiation | High | Append-only logs, restricted access to audit DB. |
| Frontend | Session hijacking (XSS) | Spoofing / Info Disclosure | High | HttpOnly secure cookies for JWT storage; output encoding. |
| Announcement API | Unauthorized broadcast | Tampering / Spoofing | Medium | Strict role and ownership checks before publishing. |
| Authentication | Brute force login attacks | Denial of Service / Spoofing | High | Rate limiting and account lockout mechanisms. |
