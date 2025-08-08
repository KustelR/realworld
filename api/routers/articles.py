import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

import lib.db as db
from utils import getSlug
from schemas import Article, Author

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


class PostingArticle(BaseModel):
    title: str
    description: str
    body: str
    tagList: list[str]

class ArticlePostBody(BaseModel):
    article: PostingArticle


@router.post("/")
async def create_article(body: ArticlePostBody):
    article = body.article

    newArticle = Article(
        title=article.title,
        description=article.description,
        body=article.body,
        tagList=article.tagList,
        slug=getSlug(article.title),
        createdAt=datetime.datetime.now().astimezone().isoformat(),
        updatedAt=datetime.datetime.now().astimezone().isoformat(),
        favoritesCount=0,
        author= Author(
            username="John Dow",
            bio="",
            image="",
        )
    )
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
    

class PuttingArticle(BaseModel):
    title: str | None = None
    description: str | None = None
    body: str | None = None

class ArticlePutBody(BaseModel):
    article: PuttingArticle


@router.put("/{slug}")
async def update_article(slug: str, body: ArticlePutBody):
    return {
        "article": db.updateArticle(slug, body.article)
    }
