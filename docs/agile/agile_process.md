# Phase 1: Agile Process

## Methodology: Scrum + XP Practices
This project utilizes a hybrid Agile methodology combining **Scrum** for project management and organizational structure with **Extreme Programming (XP)** engineering practices (such as secure coding standards, continuous integration, and frequent refactoring).

### Why this fits the project:
1. **Changing Security Landscape:** Threat models and security requirements evolve; iterative development allows adjusting security controls dynamically.
2. **Complex Integrations:** RBAC, secure APIs, and DevSecOps pipelines require continuous integration and testing rather than an all-at-once "Big Bang" approach.
3. **Early Value Delivery:** Working features like Authentication and Club Browsing can be validated early, minimizing the risk of fundamental authorization flaws later.

## Agile Manifesto Mapping
1. **Individuals and interactions over processes and tools**
   - *Mapping:* Frequent collaboration between the security engineer, developer, and product owner to clarify authorization boundaries.
2. **Working software over comprehensive documentation**
   - *Mapping:* We prioritize building the working Club Management System incrementally with integrated security, rather than just writing security policies.
3. **Customer collaboration over contract negotiation**
   - *Mapping:* Validating UI/UX flow and security controls directly with "Student" and "Coordinator" roles throughout sprints.
4. **Responding to change over following a plan**
   - *Mapping:* Adjusting the architecture or database schema when a new vulnerability (like an IDOR attack path) is discovered during sprint threat modeling.
5. **Continuous attention to technical excellence and good design enhances agility (Principle)**
   - *Mapping:* Regular security refactoring and code reviews ensure that the software remains resilient to attacks without slowing down future development.

## Sprint Structure & Security Integration
- **Sprint Duration:** 2 weeks.
- **Sprint Planning:** Includes threat modeling for new stories (e.g., adding Event Registration requires reviewing IDOR risks).
- **Daily Scrum:** Identify security blockers or failing DevSecOps CI pipeline tests.
- **Sprint Review:** Demonstrate working features (e.g., Student joining a club, Coordinator failing to modify another club's event).
- **Retrospective:** Analyze escaped defects (e.g., Why did a fuzzing test fail?).

## Refactoring Opportunities
To maintain technical and security excellence, we have planned:
- **Refactoring 1:** Move duplicated authorization checks from individual API controllers into a centralized authorization middleware/decorator. This reduces the risk of developers forgetting to add checks to new endpoints.
- **Refactoring 2:** Separate event-management business logic from API/controller logic to enable proper unit testing of the business rules without needing mock HTTP requests.

## Agile Limitations & Mitigations
1. **Limitation:** Focus on rapid delivery can lead to accumulated security debt if threat modeling is skipped.
   - **Mitigation:** Integrate security checks into the CI/CD pipeline (DevSecOps) and include "Security Testing" in the Definition of Done (DoD).
2. **Limitation:** "Working software" focus might result in insufficient documentation of complex RBAC policies.
   - **Mitigation:** Maintain a traceability matrix connecting Requirements → Threats → Implementation to keep documentation lightweight but accurate.
