from fastapi import APIRouter, HTTPException

from lib.db import authorizeUser, createUser, getUser
from schemas import AuthUser, RegistrationBody, User
from lib.auth import generateAccessToken, getPasswordHash, getEmailFromToken

router = APIRouter()


@router.post("/")
async def create_user(body: RegistrationBody):
    
    user = body.user
    return createUser(user)

@router.post("/login")
async def login(body: dict):

    email = body["user"]["email"]
    password = body["user"]["password"]
    if not email or not password:
        raise HTTPException(422, "malformed login body")
    
    user = getUser(email)
    if not user:
        raise HTTPException(400, "bad email")
    
    isPasswordCorrect = authorizeUser(email, password)
    if not isPasswordCorrect:
        raise HTTPException(400, "bad password")
    
    token = generateAccessToken(email)

    responseUser = user
    responseUser["token"] = token
    if not responseUser.get("bio"):
        responseUser["bio"] = ""
    return {"user": responseUser}
