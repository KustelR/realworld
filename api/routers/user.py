from fastapi import APIRouter, HTTPException, Request

from utils.utils import getTokenFromRequest
from utils.auth import authentificateRequest
from schemas import UpdateUserBody
from lib.db import NameTakenException, updateUser


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

    try:
        updated = updateUser(user.email, body.user)
    except NameTakenException as e:
        raise HTTPException(409, str(e))

    updated["token"] = token
    
    return {"user": updated}