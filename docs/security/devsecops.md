# DevSecOps & Secure Coding Practices

## CI/CD Pipeline Architecture
The project utilizes GitHub Actions to enforce DevSecOps principles.

**Pipeline Stages:**
1. **Checkout:** Fetch source code.
2. **Dependency Installation:** Install Python and Node.js dependencies.
3. **Build:** Compile TypeScript and build React bundle.
4. **Unit Tests:** Execute Pytest suite.
5. **Static/Security Scan (SAST):** Run Semgrep to identify dangerous coding patterns (e.g., hardcoded secrets, SQL injection risks).
6. **Container Security Scan:** Run Trivy on the generated Docker image to detect known CVEs in the base image and dependencies.
7. **Integration Tests:** Run E2E API tests against a test database.

*The pipeline is configured to fail the build if any Critical or High security vulnerabilities are detected.*

## Secure Coding & Refactoring Evidence

### Before Refactoring (Vulnerable Implementation)
```python
# VULNERABLE: Direct IDOR attack possible
@router.patch("/api/events/{event_id}")
def modify_event(event_id: int, payload: EventUpdate, db: Session = Depends(get_db)):
    # Flaw: No check if the user actually owns the club hosting this event!
    event = db.query(Event).filter(Event.id == event_id).first()
    event.title = payload.title
    db.commit()
    return {"message": "Event updated"}
```

### After Refactoring (Secure Implementation)
```python
# SECURE: Enforces Authentication, RBAC, and Resource Ownership
@router.patch("/api/events/{event_id}")
def modify_event(
    event_id: int, 
    payload: EventUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Security(get_current_user, scopes=["COORDINATOR"]) # RBAC
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Ownership Check: Is this Coordinator assigned to this event's club?
    is_authorized = db.query(ClubCoordinator).filter(
        ClubCoordinator.user_id == current_user.id,
        ClubCoordinator.club_id == event.club_id
    ).first()
    
    if not is_authorized:
        # Prevent IDOR
        raise HTTPException(status_code=403, detail="Not authorized to modify events for this club")
        
    event.title = payload.title
    db.commit()
    return {"message": "Event updated securely"}
```

## Branching Strategy
- `main` - Protected branch. Requires successful CI pipeline and code review.
- `develop` - Integration branch.
- `feature/*` - Regular feature development.
- `security/*` - Security patches and dependency updates.
