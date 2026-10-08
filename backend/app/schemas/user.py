from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    email: str
    full_name: str

# Schema for input, strips out any attempt to send 'role' to prevent privilege escalation
class UserCreate(UserBase):
    password: str

# Schema for output, safely excludes password_hash
class UserOut(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
