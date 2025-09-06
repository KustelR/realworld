from dotenv import load_dotenv
load_dotenv()


import fastapi
from routers import articles, users, user, profiles, tags
from fastapi.middleware.cors import CORSMiddleware


app = fastapi.FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(articles.router, prefix="/articles")
app.include_router(users.router, prefix="/users")
app.include_router(user.router, prefix="/user")
app.include_router(profiles.router, prefix="/profiles")
app.include_router(tags.router, prefix="/tags")