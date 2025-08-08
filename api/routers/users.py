from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.post("/")
async def create_user(body: dict):
    user = body.get("user")
    email = user.get("email")
    password = user.get("password")
    username = user.get("username")
    if not email or not password or not username:
        raise HTTPException(status_code=400, detail="Invalid user data")
    
    new_user = {
        "email": email,
        "username": username,
        "bio": "",
        "image": "",
    }
    return {
        "user": new_user
    }

    