from pydantic import BaseModel



class PuttingArticle(BaseModel):
    title: str | None = None
    description: str | None = None
    body: str | None = None

class ArticlePutBody(BaseModel):
    article: PuttingArticle



class PostingArticle(BaseModel):
    title: str
    description: str
    body: str
    tagList: list[str]

class ArticlePostBody(BaseModel):
    article: PostingArticle


class UserPublic(BaseModel):
    username: str
    bio: str = ""
    image: str = ""


class UserDatabase(UserPublic):
    email: str


class User(UserDatabase):
    password: str

class RegistrationBody(BaseModel):
    user: User

class AuthUser(User):
    token: str

class UpdateUser(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str | None = None
    image: str | None = None
    bio: str | None = None

class UpdateUserBody(BaseModel):
    user: UpdateUser

class Article(BaseModel):
    slug: str
    title: str
    description: str
    body: str
    tagList: list[str]
    createdAt: str
    updatedAt: str
    author: UserPublic


class DatabaseArticle(Article):
    deleted: bool = False;