from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import (auth,
                         users,
                         cities,
                         municipalities,
                         categories,
                         ideas,
                         votes,
                         ratings,
                         notifications,
                         dashboard)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(cities.router)
app.include_router(municipalities.router)
app.include_router(categories.router)
app.include_router(ideas.router)
app.include_router(votes.router)
app.include_router(ratings.router)
app.include_router(notifications.router)
app.include_router(dashboard.router)


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
