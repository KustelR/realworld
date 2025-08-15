import os
import pymongo

from lib.auth import generateAccessToken, getPasswordHash, verifyPassword
from schemas import Article, DatabaseArticle, UpdateUser, User

MONGODB_CONNECTION = os.environ.get("MONGODB_CONNECTION")
if not MONGODB_CONNECTION:
    raise Exception("Specify mongodb connection string through `MONGODB_CONNECTION` environment variable")




client = pymongo.MongoClient(os.getenv("MONGODB_CONNECTION"))
exclude = {"_id": 0, "deleted": 0}
db = client["realworld"]
articlesCollection = db["articles"]
passwordsCollection = db["passwords"]
usersCollection = db["users"]
followCollection = db["follows"]

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


def getUser(email: str) -> dict[str, any] | None:
    user = usersCollection.find_one({"email": email}, exclude)
    return user


def updateUser(email: str, user: UpdateUser):
    new = {k: v for k,v in user.model_dump().items() if v is not None}
    usersCollection.update_one({"email": email}, {"$set": new})
    if (user.password):
        passwordsCollection.update_one({"email": email}, {"$set": {"password": getPasswordHash(user.password)}})
    if user.email:
        passwordsCollection.update_one({"email": email}, {"$set": {"email": user.email}})
    return getUser(email)


def getProfile(username: str, whoAsked: str | None = None) -> dict[str, any] | None:
    user = usersCollection.find_one({"username": username}, exclude)
    del(user["email"])
    if whoAsked:
        user["following"] = isFollowing(whoAsked, user["username"])

    return user


def isFollowing(follower: str, following: str) -> bool:
    followerId = usersCollection.find_one({"username": follower}, {"_id": 1})
    followingId = usersCollection.find_one({"username": following}, {"_id": 1})
    return followCollection.find_one({"follower": followerId, "following": followingId}) is not None


def followUser(follower: str, following: str) -> dict[str, any]:
    followerId = usersCollection.find_one({"username": follower}, {"_id": 1})
    followingId = usersCollection.find_one({"username": following}, {"_id": 1})

    followCollection.insert_one({"follower": followerId, "following": followingId})
    return getProfile(following, follower)


def unfollowUser(follower: str, following: str) -> dict[str, any]:
    followerId = usersCollection.find_one({"username": follower}, {"_id": 1})
    followingId = usersCollection.find_one({"username": following}, {"_id": 1})

    followCollection.delete_one({"follower": followerId, "following": followingId})
    return getProfile(following, follower)