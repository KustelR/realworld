import os
import pymongo

from schemas import Article, DatabaseArticle


client = pymongo.MongoClient(os.environ.get("MONGODB_CONNECTION"))
exclude = {"_id": 0, "deleted": 0}
db = client["realworld"]
articlesCollection = db["articles"]

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