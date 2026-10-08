from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    capacity: int

class EventCreate(EventBase):
    club_id: int

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    capacity: Optional[int] = None

class EventOut(EventBase):
    id: int
    club_id: int

    class Config:
        from_attributes = True
