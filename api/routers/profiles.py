from fastapi import APIRouter, HTTPException, Request

from lib.auth import getEmailFromToken
from schemas import User, UserDatabase
from utils.auth import authentificateRequest
from lib.db import followUser, getProfile, unfollowUser
from lib.db import getUser, isFollowing 


router = APIRouter()


@router.get("/{username}")
async def get_profile(username: str, req: Request):
    user: UserDatabase | None
    try:
        user = authentificateRequest(req)
    except Exception as e:
       user = None 

    profile = getProfile(username)
    if not profile:
        raise HTTPException(404, "Profile not found")
    
    if user:
        profile["following"] = isFollowing(user.username, username)
    
    return {"profile": profile}


@router.post("/{username}/follow")
async def follow_user(username: str, req: Request):

    user = authentificateRequest(req)

    if isFollowing(user.username, username):
        raise HTTPException(400, "Already following this user")

    profile = followUser(user.username, username)

    return {"profile": profile}


@router.delete("/{username}/follow")
async def follow_user(username: str, req: Request):

    user = authentificateRequest(req)

    if not isFollowing(user.username, username):
        raise HTTPException(400, "Already not following this user")

    profile = unfollowUser(user.username, username)

    return {"profile": profile}