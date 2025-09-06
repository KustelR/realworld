from fastapi import APIRouter, HTTPException

from lib.db import authorizeUser, createUser, getUser
from schemas import LoginRequest, RegistrationBody
from lib.auth import generateAccessToken

router = APIRouter()


@router.post("/")
async def create_user(body: RegistrationBody):
    
    user = body.user
    try:
        return createUser(user)
    except Exception as e:
        raise HTTPException(409, str(e))

@router.post("/login")
async def login(body: LoginRequest):

    email = body.user.email
    password = body.user.password
    
    user = getUser(email)
    if not user:
        raise HTTPException(400, str(["wrong email"]))
    
    isPasswordCorrect = authorizeUser(email, password)
    if not isPasswordCorrect:
        raise HTTPException(400, str("wrong password"))
    
    token = generateAccessToken(email)

    responseUser = user
    responseUser["token"] = token
    if not responseUser.get("bio"):
        responseUser["bio"] = ""
    return {"user": responseUser}
