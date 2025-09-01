import os
import uuid
import pymongo

from utils.utils import isUnique
from utils.timestamp import timestamp
from lib.auth import generateAccessToken, getPasswordHash, verifyPassword
from schemas import Article, Comment, CommentDatabase, CommentPublic, DatabaseArticle, UpdateUser, User, UserDatabase


class DatabaseException(Exception):
    pass


class NameTakenException(DatabaseException):
    pass


class AuthException(DatabaseException):
    pass



MONGODB_CONNECTION = os.environ.get("MONGODB_CONNECTION")
if not MONGODB_CONNECTION:
    raise Exception("Specify mongodb connection string through `MONGODB_CONNECTION` environment variable")


exclude = {"_id": 0, "deleted": 0}


try:
    client = pymongo.MongoClient(os.getenv("MONGODB_CONNECTION"))
    db = client["realworld"]
    articlesCollection = db["articles"]
    passwordsCollection = db["passwords"]
    usersCollection = db["users"]
    followCollection = db["follows"]
    favoritesCollection = db["favorites"]
    commentsCollection = db["comments"]
    db.command("ping", check=True)

    print("Connected to MongoDB")
except Exception as e:
    raise Exception(f"Failed to connect to MongoDB: {e}")


def readArticles(query: dict[str, any] | None = None, whoAsked: str | None = None) -> list[dict[str, any]]:
    if not query:
        query = {"deleted": False}
    else:
        query["deleted"] = False

    articles: list[str, any] = list(articlesCollection.find(query, exclude))
    for article in articles:
        favorites = favoritesCollection.count_documents({"slug": article["slug"]})
        article["favoritesCount"] = favorites

        if whoAsked:
            article["favorited"] = isFavorite(whoAsked, article["slug"])
        else:
            article["favorited"] = False
    return articles


def readArticle(slug: str, whoAsked: str | None = None) -> dict[str, any] | None:
    favorites = favoritesCollection.count_documents({"slug": slug})
    entry = articlesCollection.find_one({"deleted": False, "slug": slug}, exclude)
    if not entry:
        return None
    
    entry["favoritesCount"] = favorites
    if whoAsked:
        user = getUser(whoAsked);
        entry["author"]["following"] = isFollowing(user["username"], entry["author"]["username"])
        entry["favorited"] = isFavorite(whoAsked, slug)
    else:
        entry["favorited"] = False
    return entry


def createArticle(raw: dict[str, any], author: UserDatabase):
    isNameUnique = isUnique(articlesCollection, {"slug": raw["slug"]})

    if not isNameUnique:
        raise NameTakenException("Article name already taken")

    raw["createdAt"] = raw["updatedAt"] = timestamp()
    article = DatabaseArticle.model_validate(raw)
    
    articlesCollection.insert_one(article.model_dump())
    return readArticle(article.slug, author.email)


def updateArticle(slug: str, article: Article):
    new = {k: v for k,v in article.model_dump().items() if v is not None}
    articlesCollection.update_one({"slug": slug}, {"$set": new})
    result = readArticle(slug)
    return result


def deleteArticle(slug: str):
    articlesCollection.delete_many({"slug": slug})


def createUser(user: User):
    exc = RegistrationExceptionInfo = []

    if len(user.username) < 3:
        exc.append("Username is too short")
    if not validateEmail(user.email):
        exc.append("Invalid email")
    if not isUnique(usersCollection, {"email": user.email}):
        exc.append("This email is already taken")
    if not isUnique(usersCollection, {"username": user.username}):
        exc.append("This username is already taken")
    if len(user.password) < 8:
        exc.append("Password is too short. Make it at least 8 characters")

    if (len(exc) > 0):
        raise AuthException(exc)
    
    hashed = getPasswordHash(user.password)
    passwordsCollection.insert_one({"email": user.email, "password": hashed})

    userPublic = user.model_dump()
    userPublic["bio"] = "new user"
    userPublic["image"] = "https://i.imgur.com/yindx4o.png"

    del(userPublic["password"])

    token = generateAccessToken(user.email)
    userPublic["token"] = token

    usersCollection.insert_one(userPublic.copy());
    return {"user": userPublic}


def authorizeUser(email: str, password: str):
    saved = passwordsCollection.find_one({"email": email})
    res = verifyPassword(password, saved["password"]);

    return res


def getUser(email: str | None = None, username: str | None = None) -> dict[str, any] | None:
    user = None
    if email:
        user = usersCollection.find_one({"email": email}, exclude)
    elif username:
        user = usersCollection.find_one({"username": username}, exclude)
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
    if not user:
        return None
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


def getFavorites(username: str) -> list[str]:
    user = getUser(username=username)
    uid = usersCollection.find_one({"email": user["email"]}, {"_id": 1})["_id"]
    if not uid:
        raise Exception("User not found")
    favorites = favoritesCollection.find({"u_id": uid}, {"slug": 1, "_id": 0})
    return [f["slug"] for f in favorites]


def readComment(id: str) -> CommentPublic | None:
    comment = commentsCollection.find_one({"id": id}, exclude)
    
    if not comment:
        return None

    authorEmail = comment.get("authorEmail")

    commentPublic = {
        "id": comment["id"],
        "createdAt": comment["createdAt"],
        "updatedAt": comment["updatedAt"],
        "body": comment["body"],
        "author": getUser(email=authorEmail)
    }
    

    return CommentPublic.model_validate(commentPublic)


def readComments(articleSlug: str) -> list[CommentPublic]:
    comments = commentsCollection.find({"articleSlug": articleSlug}, exclude)
    comments = [{**comment, "author": getUser(email=comment["authorEmail"])} for comment in comments]
    return [CommentPublic.model_validate(c) for c in comments]


def createComment(articleSlug: str, commentBody: str, authorEmail: str) -> dict[str, any]:    
    article = readArticle(articleSlug)

    if not article:
        raise Exception("Article not found")
    
    raw = {
        "id": uuid.uuid4().hex,
        "articleSlug": articleSlug,
        "authorEmail": authorEmail,
        "body": commentBody,
        "createdAt": timestamp(),
        "updatedAt": timestamp()
    }
    comment = CommentDatabase.model_validate(raw)

    commentsCollection.insert_one(comment.model_dump())
    return readComment(comment.id)


def getTags() -> list[str]:
    tags = articlesCollection.distinct("tagList")
    return sorted(tags)


def validateEmail(email: str) -> bool:
    if len(email) < 5:
        return False
    return True