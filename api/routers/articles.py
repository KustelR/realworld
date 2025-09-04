from fastapi import APIRouter, HTTPException, Request

from utils.sortPipelines import getAuthorNewestSortPipeline, getNewestSortPipeline
import lib.db as db
from utils.auth import authentificateRequest
from utils.utils import getSlug
from schemas import Article, ArticlePostBody, ArticlePutBody, CommentPostBody, UserDatabase, UserPublic

router = APIRouter()



@router.get("/feed")
async def read_feed(req: Request, offset: int | None = None, limit: int = 20):

    user = authentificateRequest(req)

    followed = db.getFollowed(user.username)
    
    pipeline = []
    pipeline += getAuthorNewestSortPipeline(followed)

    if offset:
        pipeline.append({"$skip": offset})
    pipeline.append({"$limit": limit})

    articles = db.readArticles(pipeline, user.email)
    return {
        "articles": articles,
        "articlesCount": len(articles)
    }


@router.get("/")
async def read_articles(req: Request, author: str = None, favorited: str = None, tag: str = None, limit: int = 20, offset: int | None = None):

    user: UserDatabase | None
    try:
        user = authentificateRequest(req)
    except HTTPException:
        user = None

    query: dict[str, any] = {"deleted": False}
    if author:
        query["author.username"] = author
    if tag:
        query["tagList"] = tag
    if favorited and user:
        query["slug"] = {"$in": db.getFavorites(favorited)}
    
    pipeline = []
    pipeline.append({"$match": query})
    if offset:
        pipeline.append({"$skip": offset})
    pipeline.append({"$limit": limit})
    pipeline += getNewestSortPipeline()

    articles = db.readArticles(pipeline, user.email if user else None)
    for article in articles:
        tagList = sorted(article["tagList"], key=lambda x: 0 if x == tag else 1) if tag else article["tagList"]
        article["tagList"] = tagList

    return {
        "articles": articles,
        "articlesCount": len(articles)
    }



@router.post("/")
async def create_article(body: ArticlePostBody, req: Request):
    article = body.article.model_dump()

    user = authentificateRequest(req)
    
    article["author"] = user
    article["slug"] = getSlug(article["title"])

    try:
        created = db.createArticle(article, user)
    except db.NameTakenException as e:
        raise HTTPException(409, "Article name is already taken")

    return {
        "article": created
    }


@router.get("/{slug}")
async def read_article(slug: str, req: Request):

    user: UserDatabase | None
    try:
        user = authentificateRequest(req)
    except HTTPException:
        user = None

    article = db.readArticle(slug, user.email if user else None)
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


@router.post("/{slug}/favorite")
async def favorite_article(slug: str, req: Request):

    user = authentificateRequest(req)

    
    isFavorited = db.isFavorite(user.email, slug)
    if isFavorited:
        raise HTTPException(400, "Already favorited this article")
    
    favorited = db.favoriteArticle(user.email, slug)

    return {
        "article": favorited
    }


@router.delete("/{slug}/favorite")
async def unfavorite_article(slug: str, req: Request):

    user = authentificateRequest(req)
    
    isFavorited = db.isFavorite(user.email, slug)
    if not isFavorited:
        raise HTTPException(400, "Not favorited this article")

    unfavorited = db.unfavoriteArticle(user.email, slug)

    return {
        "article": unfavorited
    }


@router.get("/{slug}/comments")
async def read_comments(slug: str):
    comments = db.readComments(slug)
    return {
        "comments": comments
    }


@router.post("/{slug}/comments")
async def create_comment(slug: str, body: CommentPostBody, req: Request):

    user = authentificateRequest(req)

    comment = db.createComment(slug, body.comment.body, user.email)
    return {
        "comment": comment
    }