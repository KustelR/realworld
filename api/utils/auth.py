from fastapi import HTTPException, Request
from utils.utils import getTokenFromRequest
from schemas import User, UserDatabase
from lib.auth import getEmailFromToken
from lib.db import getUser


def authentificateRequest(req: Request) -> User:
    token = getTokenFromRequest(req)
    if not token:
        raise HTTPException(401, "Authorization header missing")

    try:
        email = getEmailFromToken(token)
    except Exception as e:
        raise HTTPException(401, f"Invalid token: {str(e)}")
    
    user = getUser(email)
    if not user:
        raise HTTPException(404, "User not found")
    
    return UserDatabase.model_validate(user)