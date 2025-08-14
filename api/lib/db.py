import os
import pymongo

from lib.auth import generateAccessToken, getPasswordHash, verifyPassword
from schemas import Article, DatabaseArticle, User

MONGODB_CONNECTION = os.environ.get("MONGODB_CONNECTION")
if not MONGODB_CONNECTION:
    raise Exception("Specify mongodb connection string through `MONGODB_CONNECTION` environment variable")




client = pymongo.MongoClient(os.getenv("MONGODB_CONNECTION"))
exclude = {"_id": 0, "deleted": 0}
db = client["realworld"]
articlesCollection = db["articles"]
passwordsCollection = db["passwords"]
usersCollection = db["users"]

print("Connected to MongoDB")


def readArticles():
    return list(articlesCollection.find({"deleted": False}, exclude))


def readArticle(slug: str):
    return articlesCollection.find_one({"deleted": False, "slug": slug}, exclude)


def createArticle(article: Article):

    articlesCollection.insert_one(DatabaseArticle.model_validate(article.model_dump()).model_dump())
    return article


def updateArticle(slug: str, article: Article):
    new = {k: v for k,v in article.model_dump().items() if v is not None}
    articlesCollection.update_one({"slug": slug}, {"$set": new})
    return article


def deleteArticle(slug: str):
    articlesCollection.delete_many({"slug": slug})


def createUser(user: User):
    hashed = getPasswordHash(user.password)
    passwordsCollection.insert_one({"email": user.email, "password": hashed})

    userPublic = user.model_dump()

    del(userPublic["password"])
    usersCollection.insert_one(userPublic.copy());

    token = generateAccessToken(user.email)
    userPublic["token"] = token

    return {"user": userPublic}


def authorizeUser(email: str, password: str):
    saved = passwordsCollection.find_one({"email": email})
    res = verifyPassword(password, saved["password"]);

    return res


def getUser(email: str):
    return usersCollection.find_one({"email": email}, exclude)