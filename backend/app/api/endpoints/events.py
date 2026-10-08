from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from app.database import get_db
from app.models.event import Event, EventRegistration
from app.models.club import ClubCoordinator, Membership
from app.models.user import User, AuditLog
from app.schemas.event import EventCreate, EventUpdate, EventOut
from app.api.dependencies import get_current_active_user, require_role

router = APIRouter()

@router.get("/", response_model=List[EventOut])
def list_events(db: Session = Depends(get_db)):
    return db.query(Event).all()

@router.post("/", response_model=EventOut)
def create_event(
    event_in: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["COORDINATOR", "ADMIN"]))
):
    start_time = datetime.fromisoformat(event_in.start_time.replace('Z', '+00:00'))
    
    if current_user.role == "COORDINATOR":
        is_authorized = db.query(ClubCoordinator).filter(
            ClubCoordinator.user_id == current_user.id,
            ClubCoordinator.club_id == event_in.club_id
        ).first()
        if not is_authorized:
            raise HTTPException(status_code=403, detail="Not authorized to create events for this club")

    new_event = Event(
        club_id=event_in.club_id,
        title=event_in.title,
        description=event_in.description,
        start_time=start_time,
        capacity=event_in.capacity
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    
    db.add(AuditLog(user_id=current_user.id, action="CREATE_EVENT", resource=f"Event:{new_event.id}"))
    db.commit()
    
    return new_event

@router.patch("/{event_id}", response_model=EventOut)
def update_event(
    event_id: int,
    event_in: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["COORDINATOR", "ADMIN"]))
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if current_user.role == "COORDINATOR":
        # IDOR Protection: Verify Coordinator owns the club associated with this event
        is_authorized = db.query(ClubCoordinator).filter(
            ClubCoordinator.user_id == current_user.id,
            ClubCoordinator.club_id == event.club_id
        ).first()
        if not is_authorized:
            db.add(AuditLog(user_id=current_user.id, action="UNAUTHORIZED_MODIFICATION_ATTEMPT", resource=f"Event:{event.id}"))
            db.commit()
            raise HTTPException(status_code=403, detail="Not authorized to modify events for this club")
            
    if event_in.title is not None:
        event.title = event_in.title
    if event_in.description is not None:
        event.description = event_in.description
    if event_in.start_time is not None:
        event.start_time = datetime.fromisoformat(event_in.start_time.replace('Z', '+00:00'))
    if event_in.capacity is not None:
        event.capacity = event_in.capacity
        
    db.commit()
    db.refresh(event)
    db.add(AuditLog(user_id=current_user.id, action="UPDATE_EVENT", resource=f"Event:{event.id}"))
    db.commit()
    return event

@router.post("/{event_id}/register")
def register_for_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Check membership
    is_member = db.query(Membership).filter(
        Membership.user_id == current_user.id,
        Membership.club_id == event.club_id
    ).first()
    if not is_member:
        raise HTTPException(status_code=403, detail="Must be a club member to register for events")
        
    # Check existing registration
    existing_reg = db.query(EventRegistration).filter(
        EventRegistration.user_id == current_user.id,
        EventRegistration.event_id == event_id
    ).first()
    if existing_reg:
        raise HTTPException(status_code=400, detail="Already registered for this event")
        
    # Check capacity
    current_regs = db.query(EventRegistration).filter(EventRegistration.event_id == event_id).count()
    if current_regs >= event.capacity:
        raise HTTPException(status_code=400, detail="Event is at full capacity")
        
    new_reg = EventRegistration(user_id=current_user.id, event_id=event_id)
    db.add(new_reg)
    db.commit()
    return {"message": "Successfully registered for event"}
