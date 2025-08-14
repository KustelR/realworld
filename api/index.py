from dotenv import load_dotenv
load_dotenv()


import fastapi
from routers import articles, users


app = fastapi.FastAPI()
app.include_router(articles.router, prefix="/articles")
app.include_router(users.router, prefix="/users")