from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Club(Base):
    __tablename__ = "clubs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    memberships = relationship("Membership", back_populates="club")
    coordinators = relationship("ClubCoordinator", back_populates="club")
    events = relationship("Event", back_populates="club")
    announcements = relationship("Announcement", back_populates="club")

class ClubCoordinator(Base):
    __tablename__ = "club_coordinators"
    
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), primary_key=True)
    
    user = relationship("User", back_populates="managed_clubs")
    club = relationship("Club", back_populates="coordinators")

class Membership(Base):
    __tablename__ = "memberships"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), primary_key=True)
    joined_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="memberships")
    club = relationship("Club", back_populates="memberships")

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    club_id = Column(Integer, ForeignKey("clubs.id"))
    content = Column(String, nullable=False)
    posted_at = Column(DateTime, default=datetime.utcnow)

    club = relationship("Club", back_populates="announcements")
