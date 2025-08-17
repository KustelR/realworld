from fastapi import Request, HTTPException

from schemas import User, UserDatabase
from lib.auth import getEmailFromToken
from lib.db import getUser



def getSlug(title: str) -> str:
    return title.lower().replace(" ", "-")


def getTokenFromRequest(req: Request) -> str:
    try:
        return req.headers.get("Authorization").split(" ")[1]
    except Exception as e:
        raise HTTPException(401, "Unprocessable authentification header")


def authentificateRequest(req: Request) -> User:
    token = getTokenFromRequest(req)
    if not token:
        raise Exception("Authorization header missing")

    try:
        email = getEmailFromToken(token)
    except Exception as e:
        raise Exception(f"Invalid token: {str(e)}")
    
    user = getUser(email)
    if not user:
        raise Exception("User not found")
    
    return UserDatabase.model_validate(user)
 