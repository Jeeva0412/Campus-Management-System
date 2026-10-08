from pydantic import BaseModel
from typing import Optional, List

class ClubBase(BaseModel):
    name: str
    description: str

class ClubCreate(ClubBase):
    pass

class ClubOut(ClubBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class AnnouncementBase(BaseModel):
    content: str

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementOut(AnnouncementBase):
    id: int
    club_id: int
    posted_at: str

    class Config:
        from_attributes = True
