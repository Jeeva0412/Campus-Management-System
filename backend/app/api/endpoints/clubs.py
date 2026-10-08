from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.club import Club, Membership, ClubCoordinator
from app.models.user import User, AuditLog
from app.schemas.club import ClubCreate, ClubOut
from app.api.dependencies import get_current_active_user, require_role

router = APIRouter()

@router.get("/", response_model=List[ClubOut])
def read_clubs(db: Session = Depends(get_db)):
    return db.query(Club).filter(Club.is_active == True).all()

@router.post("/", response_model=ClubOut)
def create_club(
    club_in: ClubCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"]))
):
    new_club = Club(name=club_in.name, description=club_in.description)
    db.add(new_club)
    db.commit()
    db.refresh(new_club)
    
    db.add(AuditLog(user_id=current_user.id, action="CREATE_CLUB", resource=f"Club:{new_club.id}"))
    db.commit()
    return new_club

@router.post("/{club_id}/join")
def join_club(
    club_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    club = db.query(Club).filter(Club.id == club_id, Club.is_active == True).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
        
    existing_membership = db.query(Membership).filter(
        Membership.user_id == current_user.id, Membership.club_id == club_id
    ).first()
    
    if existing_membership:
        raise HTTPException(status_code=400, detail="Already a member")
        
    membership = Membership(user_id=current_user.id, club_id=club_id)
    db.add(membership)
    db.commit()
    return {"message": "Successfully joined club"}

@router.get("/{club_id}/members")
def get_club_members(
    club_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["COORDINATOR", "ADMIN"]))
):
    if current_user.role == "COORDINATOR":
        # Cross-club Member Data Exposure Protection
        is_authorized = db.query(ClubCoordinator).filter(
            ClubCoordinator.user_id == current_user.id,
            ClubCoordinator.club_id == club_id
        ).first()
        if not is_authorized:
            raise HTTPException(status_code=403, detail="Not authorized to view members of this club")
            
    members = db.query(User).join(Membership).filter(Membership.club_id == club_id).all()
    # Exclude sensitive data
    return [{"id": m.id, "full_name": m.full_name, "email": m.email} for m in members]

@router.delete("/{club_id}/members/{user_id}")
def remove_club_member(
    club_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["COORDINATOR", "ADMIN"]))
):
    if current_user.role == "COORDINATOR":
        is_authorized = db.query(ClubCoordinator).filter(
            ClubCoordinator.user_id == current_user.id,
            ClubCoordinator.club_id == club_id
        ).first()
        if not is_authorized:
            db.add(AuditLog(user_id=current_user.id, action="UNAUTHORIZED_KICK_ATTEMPT", resource=f"Club:{club_id}"))
            db.commit()
            raise HTTPException(status_code=403, detail="Not authorized to manage members of this club")
            
    membership = db.query(Membership).filter(
        Membership.club_id == club_id,
        Membership.user_id == user_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")
        
    db.delete(membership)
    db.add(AuditLog(user_id=current_user.id, action="KICK_MEMBER", resource=f"User:{user_id}_Club:{club_id}"))
    db.commit()
    return {"message": "Member successfully removed from club"}
