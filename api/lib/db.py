import os
import pymongo

from schemas import Article


client = pymongo.MongoClient(os.environ.get("MONGODB_CONNECTION"))
db = client["realworld"]
articlesCollection = db["articles"]

print("Connected to MongoDB")


def readArticles():
    return list(articlesCollection.find({}, {"_id": 0}))


def readArticle(slug: str):
    return articlesCollection.find_one({"slug": slug}, {"_id": 0})


def createArticle(article: Article):
    articlesCollection.insert_one(article.model_dump())
    return article


def updateArticle(slug: str, article: Article):
    new = {k: v for k,v in article.model_dump().items() if v is not None}
    articlesCollection.update_one({"slug": slug}, {"$set": new})
    return article