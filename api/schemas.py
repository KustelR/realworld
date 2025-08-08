from pydantic import BaseModel

class Author(BaseModel):
    username: str
    bio: str
    image: str

class Article(BaseModel):
    slug: str
    title: str
    description: str
    body: str
    tagList: list[str]
    createdAt: str
    updatedAt: str
    favoritesCount: int
    author: Author
