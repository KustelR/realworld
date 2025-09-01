from fastapi import APIRouter, HTTPException, Request

from utils.utils import getTokenFromRequest
from utils.auth import authentificateRequest
from schemas import UpdateUserBody, UserDatabase
from lib.auth import getEmailFromToken
from lib.db import authorizeUser, getUser, updateUser


router = APIRouter()


@router.get("/")
async def get_user(req: Request):

    token = getTokenFromRequest(req)
    user = authentificateRequest(req)
        
    result = user.model_dump()
    result["token"] = token
    return {"user": result}



@router.put("/")
async def update_user(req: Request, body: UpdateUserBody):
    user = authentificateRequest(req)
    token = getTokenFromRequest(req)

    updated = updateUser(user.email, body.user)
    updated["token"] = token
    
    return {"user": updated}