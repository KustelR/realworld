from fastapi import APIRouter, HTTPException, Request

from utils.utils import authentificateRequest, getTokenFromRequest
from schemas import UpdateUserBody, UserDatabase
from lib.auth import getEmailFromToken
from lib.db import authorizeUser, getUser, updateUser


router = APIRouter()


@router.get("/")
async def get_user(req: Request):
    token = getTokenFromRequest(req)
    if not token:
        raise HTTPException(401, "Authorization header missing")

    try:
        email = getEmailFromToken(token)
    except Exception as e:
        raise HTTPException(401, f"Invalid token: {str(e)}")
    if not email:
        raise HTTPException(401, "Invalid token")

    user = getUser(email)
    if not user:
        raise HTTPException(404, "User not found")
    
    user["token"] = token
    return {"user": user}


@router.put("/")
async def update_user(req: Request, body: UpdateUserBody):

    user: UserDatabase
    try:
        user = authentificateRequest(req)
    except Exception as e:
        raise HTTPException(401, f"Authentication failed: {str(e)}")

    if not user:
        raise HTTPException(404, "User not found")



    updated = updateUser(user.email, body.user)
    updated["token"] = getTokenFromRequest(req)
    
    return {"user": updated}