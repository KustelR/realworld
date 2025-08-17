from fastapi import APIRouter, HTTPException, Request

from lib import db


router = APIRouter()


@router.get("/")
async def get_tags():
    try:
        tags = db.getTags()
        return {"tags": tags}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))