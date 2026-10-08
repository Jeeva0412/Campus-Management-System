# Secure College Club Management System

**24CYS401 — Secure Software Engineering Integrated Project**

## Overview
The Secure College Club Management System is a comprehensive platform designed for managing college clubs, memberships, events, and announcements. Security is treated as a primary feature, and the development process follows the complete Secure Software Engineering workflow, from Agile requirements and threat modeling to secure coding, DevSecOps containerization, and final security reviews.

## Core Features
- **Role-Based Access Control (RBAC):** Strict separation between Students, Coordinators, and Administrators.
- **Data Protection:** Prevention of IDOR/BOLA attacks and cross-club data exposure.
- **Club & Event Management:** Club discovery, membership tracking, event creation, and registrations.
- **Security-First Architecture:** Centralized authorization middleware, secure sessions, audit logging.

## Project Structure
```text
college-club-management/
├── frontend/             # React + Vite + TypeScript frontend
├── backend/              # FastAPI + Python secure backend
├── database/             # PostgreSQL schemas and migrations
├── tests/                # Unit, integration, E2E, and security tests
├── security/             # Security configurations and scan results
├── k8s/                  # Kubernetes manifests
├── docker/               # Dockerfiles and docker-compose
├── .github/workflows/    # CI/CD Pipeline
└── docs/                 # Software engineering artifacts
```

## Getting Started
Please refer to the `docs/` directory for system documentation, requirements, architectures, and threat models.

### How to Run (Local Development)

**1. Start the Backend & Database with Docker Compose**
This will automatically build and start the PostgreSQL database and FastAPI backend securely:
```bash
docker-compose up --build -d
```
The backend API will be available at `http://localhost:8080`.

**2. Start the Frontend Application**
Open a new terminal in the `frontend/` directory and install dependencies, then run the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
The application UI will be available at `http://localhost:5173`.

**3. Demo Accounts**
The database is automatically seeded with demo data when built. You can use the following accounts to test the Role-Based Access Control:
- **Admin**: `admin@college.local` | Password: `password123`
- **Coordinator**: `coord@college.local` | Password: `password123`
- **Student**: `student@college.local` | Password: `password123`
