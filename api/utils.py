from fastapi import Request, HTTPException



def getSlug(title: str) -> str:
    return title.lower().replace(" ", "-")


def getTokenFromRequest(req: Request) -> str:
    try:
        return req.headers.get("Authorization").split(" ")[1]
    except Exception as e:
        raise HTTPException(401, "Unprocessable authentification header")