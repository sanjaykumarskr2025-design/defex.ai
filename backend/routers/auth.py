from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import User, get_db
from schemas import UserCreate, User as UserSchema, TokenResponse
from auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    db_user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=get_password_hash(user_data.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Generate token
    access_token = create_access_token(data={"sub": db_user.id})

    return {
        "access_token": access_token,
        "user": UserSchema.from_orm(db_user)
    }

@router.post("/login", response_model=TokenResponse)
async def login(email: str, password: str, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Generate token
    access_token = create_access_token(data={"sub": user.id})

    return {
        "access_token": access_token,
        "user": UserSchema.from_orm(user)
    }

@router.get("/me", response_model=UserSchema)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserSchema.from_orm(current_user)

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logged out successfully"}
