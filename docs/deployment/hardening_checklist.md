# Phase 15 & 16: Deployment Hardening Checklist

## Access Control
- [x] Enforce Principle of Least Privilege across all IAM roles.
- [x] Ensure strong authentication (JWT with secure secrets, HttpOnly cookies).
- [x] Backend RBAC thoroughly tested and enabled.

## Network & Ports
- [x] Only required ports exposed (e.g., 443 for HTTPS, internal 8000 for backend).
- [x] Database port (5432) is NOT publicly exposed; accessible only by backend containers.

## Secrets Management
- [x] No hard-coded credentials in the repository.
- [x] Use Kubernetes Secrets or `.env` files exclusively for sensitive configuration.
- [x] `.env` is included in `.gitignore`.

## Infrastructure & Containers
- [x] Dockerfile utilizes a minimal base image (e.g., `python:3.11-slim` or `alpine`).
- [x] Container runs under a non-root user (`appuser`).
- [x] Container filesystems are set to read-only where possible.
- [x] Base images are regularly updated to patch OS-level vulnerabilities.

## Database Security
- [x] Application uses a restricted DB account, not the `postgres` superuser.
- [x] Strong, randomly generated passwords used for DB service accounts.
- [x] SQL injection prevented via SQLAlchemy parameterized queries (ORM).

## Operational Security
- [x] Backup procedures documented and automated.
- [x] Centralized logging enabled for security-relevant events (e.g., login failures).
- [x] Server room access controls and incident response plans updated in college policies.
