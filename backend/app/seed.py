from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.club import Club, ClubCoordinator
from app.models.event import Event
from app.core.security import get_password_hash
from datetime import datetime, timedelta

def seed():
    db = SessionLocal()
    
    if db.query(User).first():
        print("Database already seeded.")
        return

    print("Seeding Users...")
    precomputed_hash = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjIQOa0iXy" # Hash for 'password123'
    
    admin = User(email="admin@college.local", full_name="System Administrator", password_hash=precomputed_hash, role="ADMIN")
    coordinator = User(email="coordinator@college.local", full_name="Cyber Coordinator", password_hash=precomputed_hash, role="COORDINATOR")
    student = User(email="student@college.local", full_name="Jane Student", password_hash=precomputed_hash, role="STUDENT")
    
    db.add_all([admin, coordinator, student])
    db.commit()

    print("Seeding Clubs...")
    cyber = Club(name="Cyber Security Club", description="Learn ethical hacking, defense, and participate in CTFs.")
    coding = Club(name="Coding Club", description="Algorithm, data structures, and software development.")
    robotics = Club(name="Robotics Club", description="Build and program autonomous robots.")
    photography = Club(name="Photography Club", description="Capture the world through lenses.")
    
    db.add_all([cyber, coding, robotics, photography])
    db.commit()

    print("Assigning Coordinator...")
    db.add(ClubCoordinator(user_id=coordinator.id, club_id=cyber.id))
    
    print("Seeding Events...")
    db.add(Event(club_id=cyber.id, title="Capture The Flag 2026", description="Annual university CTF competition.", start_time=datetime.utcnow() + timedelta(days=5), capacity=50))
    db.add(Event(club_id=coding.id, title="Hackathon Kickoff", description="24 hour coding marathon.", start_time=datetime.utcnow() + timedelta(days=10), capacity=100))
    
    db.commit()
    db.close()
    print("Database seeded successfully with Demo Data!")

if __name__ == "__main__":
    seed()
