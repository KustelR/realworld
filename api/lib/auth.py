from datetime import timezone, timedelta, datetime
import os
import jwt
from passlib.context import CryptContext


SECRET = os.environ.get("SECRET_KEY")
if not SECRET:
    raise Exception("Specify secret key through `SECRET_KEY` environment variable")

ALGORITHM = "HS256"


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def getPasswordHash(plain: str) -> str:
    return pwd_context.hash(plain)


def verifyPassword(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def generateAccessToken(email: str, ):
    payload = {}
    payload["email"] = email
    return jwt.encode(payload, SECRET, ALGORITHM)

def getEmailFromToken(token: str) -> str:
    user: str
    payload = jwt.decode(token, SECRET, ALGORITHM)
    user = payload["email"]

    if not user:
        raise Exception("malformed token")

    
    return user