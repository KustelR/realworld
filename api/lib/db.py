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
favoritesCollection = db["favorites"]

print("Connected to MongoDB")


def readArticles(whoAsked: str | None = None) -> list[dict[str, any]]:
    articles: list[str, any] = list(articlesCollection.find({"deleted": False}, exclude))
    for article in articles:
        favorites = favoritesCollection.count_documents({"slug": article["slug"]})
        article["favoritesCount"] = favorites

        if whoAsked:
            print(whoAsked, article["slug"], isFavorite(whoAsked, article["slug"]))
            article["favorited"] = isFavorite(whoAsked, article["slug"])
        else:
            article["favorited"] = False
    return articles


def readArticle(slug: str, whoAsked: str | None = None) -> dict[str, any] | None:
    favorites = favoritesCollection.count_documents({"slug": slug})
    entry = articlesCollection.find_one({"deleted": False, "slug": slug}, exclude)
    entry["favoritesCount"] = favorites
    if whoAsked:
        entry["favorited"] = isFavorite(whoAsked, slug)
    else:
        entry["favorited"] = False
    return entry


def createArticle(article: Article):

    articlesCollection.insert_one(DatabaseArticle.model_validate(article.model_dump()).model_dump())
    return article


def updateArticle(slug: str, article: Article):
    new = {k: v for k,v in article.model_dump().items() if v is not None}
    articlesCollection.update_one({"slug": slug}, {"$set": new})
    result = readArticle(slug)
    return result


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


def isFavorite(email: str, slug: str) -> bool:

    uid = usersCollection.find_one({"email": email}, {"_id": 1})["_id"]
    if not uid:
        raise Exception("User not found")

    article = readArticle(slug)
    if not article:
        raise Exception("Article not found")

    entry = favoritesCollection.find_one({"u_id": uid, "slug": slug})
    return entry is not None


def favoriteArticle(email: str, slug: str) -> dict[str, any]:
    uid = usersCollection.find_one({"email": email}, {"_id": 1})["_id"]
    if not uid:
        raise Exception("User not found")

    if not readArticle(slug):
        raise Exception("Article not found")

    favoritesCollection.insert_one({"u_id": uid, "slug": slug})
    return readArticle(slug, email)


def unfavoriteArticle(email: str, slug: str) -> dict[str, any]:
    uid = usersCollection.find_one({"email": email}, {"_id": 1})["_id"]
    if not uid:
        raise Exception("User not found")

    if not readArticle(slug):
        raise Exception("Article not found")

    favoritesCollection.delete_one({"u_id": uid, "slug": slug})
    return readArticle(slug, email)