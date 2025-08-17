from fastapi import APIRouter, HTTPException, Request

import lib.db as db
from utils.utils import authentificateRequest, getSlug
from schemas import Article, ArticlePostBody, ArticlePutBody, CommentPostBody, UserDatabase, UserPublic

router = APIRouter()



@router.get("/feed")
async def read_feed(req: Request):


    user: UserDatabase
    try:
        user = authentificateRequest(req)
    except Exception as e:
        raise HTTPException(401, f"Authentication failed: {str(e)}")

    articles = db.readArticles(None, user.email)
    return {
        "articles": articles,
        "articlesCount": len(articles)
    }


@router.get("/")
async def read_articles(req: Request, author: str = None, favorited: str = None, tag: str = None):

    user: UserDatabase | None
    try:
        user = authentificateRequest(req)
    except Exception as e:
        user = None

    query: dict[str, any] = {"deleted": False}
    if author:
        query["author.username"] = author
    if tag:
        query["tagList"] = tag
    if favorited:
        query["slug"] = {"$in": db.getFavorites(favorited)}

    articles = db.readArticles(query, user.email if user else None)
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

    user: UserDatabase
    try:
        user = authentificateRequest(req)
    except Exception as e:
        raise HTTPException(401, f"Authentication failed: {str(e)}")
    
    article["author"] = user
    article["slug"] = getSlug(article["title"])

    created = db.createArticle(article, user)

    return {
        "article": created
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


@router.post("/{slug}/favorite")
async def favorite_article(slug: str, req: Request):
    
    user: UserDatabase
    try:
        user = authentificateRequest(req)
    except Exception as e:
        raise HTTPException(401, f"Authentication failed: {str(e)}")
    
    isFavorited = db.isFavorite(user.email, slug)
    if isFavorited:
        raise HTTPException(400, "Already favorited this article")
    
    favorited = db.favoriteArticle(user.email, slug)

    return {
        "article": favorited
    }


@router.delete("/{slug}/favorite")
async def unfavorite_article(slug: str, req: Request):

    user: UserDatabase
    try:
        user = authentificateRequest(req)
    except Exception as e:
        raise HTTPException(401, f"Authentication failed: {str(e)}")
    
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
    
    user: UserDatabase
    try:
        user = authentificateRequest(req)
    except Exception as e:
        raise HTTPException(401, f"Authentication failed: {str(e)}")

    comment = db.createComment(slug, body.comment.body, user.email)
    return {
        "comment": comment
    }