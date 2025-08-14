import datetime
from fastapi import APIRouter, HTTPException

import lib.db as db
from utils import getSlug
from schemas import Article, Author, ArticlePostBody, ArticlePutBody

router = APIRouter()



@router.get("/feed")
async def read_feed():
    articles = db.readArticles()
    return {
        "articles": articles,
        "articlesCount": len(articles)
    }


@router.get("/")
async def read_articles(author: str = None, tag: str = None):
    articles = db.readArticles()
    return {
        "articles": articles,
        "articlesCount": len(articles)
    }



@router.post("/")
async def create_article(body: ArticlePostBody):
    article = body.article.model_dump()
    article["slug"] = getSlug(article["title"])
    article["author"] = Author(
        username="Joe",
        bio="",
        image=""
    )
    article["favoritesCount"] = 0
    article["createdAt"] = datetime.datetime.now().astimezone().isoformat() 
    article["updatedAt"] = datetime.datetime.now().astimezone().isoformat() 

    newArticle = Article.model_validate(article);
    db.createArticle(newArticle)

    return {
        "article": newArticle
    }


@router.get("/{slug}")
async def read_article(slug: str):
    article = db.readArticle(slug)
    if article:
        return {
            "article": article
        }
    else:
        raise HTTPException(status_code=404, detail="Article not found")
    

@router.put("/{slug}")
async def update_article(slug: str, body: ArticlePutBody):
    return {
        "article": db.updateArticle(slug, body.article)
    }


@router.delete("/{slug}")
async def delete_article(slug: str):
    db.deleteArticle(slug);
    return "success"
