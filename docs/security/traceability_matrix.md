# Phase 16: Traceability Matrix

This matrix establishes the explicit traceability chain from high-level security requirements down to implementation and deployment controls.

| Requirement | Use Case | DFD | Threat | Vulnerability | Attack Tree | User Story | Implementation | Test | Deployment Control |
|---|---|---|---|---|---|---|---|---|---|
| **SEC-01 (Secure Auth)** | UC-01 (Auth) | DFD-1.0 | T-01 (Spoofing) | V-07 (Broken Auth) | N/A | US-01 | Bcrypt hashing, HttpOnly JWT cookies | ST-01 (Brute-force test) | HTTPS/TLS Enforcement |
| **SEC-02 (Event Ownership)** | UC-02 (Modify Event) | DFD-3.0 (Boundary Check) | T-02 (Tampering) | V-01 (IDOR) | AT-01 (Modify Another Club) | US-07 | `verifyEventOwnership` authorization middleware | ST-02 (Coordinator attempts IDOR) | RBAC enabled |
| **SEC-03 (Member Privacy)** | UC-03 (View Members) | DFD-2.0 | T-03 (Info Disclosure) | V-04 (Cross-club Exposure) | N/A | US-08 | Query filters matching assigned clubs | ST-03 (Unauthorized member fetch) | Principle of Least Privilege |
| **SEC-04 (No Privilege Escalation)** | UC-04 (Update Profile) | DFD-4.0 | T-04 (Elevation) | V-02 (Privilege Escalation) | AT-02 (Inject Role) | US-06 | Pydantic DTOs stripping `role` | ST-04 (Fuzzing role field) | Input Validation |
| **SEC-05 (Audit Logging)** | All Mutating UCs | DFD-D4 | T-05 (Repudiation) | V-08 (Missing Audit) | N/A | US-11 | Global `AuditService` decorator | ST-05 (Verify logs on delete) | Restricted Audit DB access |
