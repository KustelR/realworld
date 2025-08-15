from dotenv import load_dotenv
load_dotenv()


import fastapi
from routers import articles, users, user, profiles


app = fastapi.FastAPI()
app.include_router(articles.router, prefix="/articles")
app.include_router(users.router, prefix="/users")
app.include_router(user.router, prefix="/user")
app.include_router(profiles.router, prefix="/profiles")