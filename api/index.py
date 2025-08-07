import fastapi
import datetime
from fastapi import HTTPException
from utils import getSlug
from mocks import mockArticles


app = fastapi.FastAPI()


@app.get("/articles/feed")
async def read_feed():    return {
        "articles": mockArticles.copy(),
        "articlesCount": len(mockArticles)
    }


@app.get("/articles")
async def read_articles(author: str = None, tag: str = None):
    articles = mockArticles.copy()
    if author:
        articles = list(filter(lambda article: not author or article['author'] == author, articles))
    if tag:
        articles = list(filter(lambda article: tag in article['tagList'], articles))
    return {
        "articles": articles,
        "articlesCount": len(articles)
    }


@app.post("/articles")
async def create_article(body: dict):
    article = body.get("article")
    if not article or "title" not in article or "body" not in article:
        raise HTTPException(status_code=400, detail="Invalid article data")
    
    article["slug"] = getSlug(article["title"])
    timestamp = datetime.datetime.now().astimezone().isoformat()
    article["createdAt"] = timestamp
    article["updatedAt"] = timestamp

    article["author"] = "John Dow"
    article["favorited"] = False
    article["favoritesCount"] = 0
    mockArticles.append(article)
    
    return {
        "article": article
    }


@app.get("/articles/{slug}")
async def read_article(slug: str):
    article = next((article for article in mockArticles if article['slug'] == slug), None)
    if article:
        return {
            "article": article
        }
    else:
        raise HTTPException(status_code=404, detail="Article not found")
    

@app.put("/articles/{slug}")
async def update_article(slug: str, body: dict):
    existing_article = next((a for a in mockArticles if a['slug'] == slug), None)
    if not existing_article:
        raise HTTPException(status_code=404, detail="Article not found")
    

    existing_article.update(body["article"])
    return {
        "article": existing_article
    }


@app.post("/users")
async def create_user(body: dict):
    user = body.get("user")
    email = user.get("email")
    password = user.get("password")
    username = user.get("username")
    if not email or not password or not username:
        raise HTTPException(status_code=400, detail="Invalid user data")
    
    new_user = {
        "email": email,
        "username": username,
        "bio": "",
        "image": "",
    }
    return {
        "user": new_user
    }

    
