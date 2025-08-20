from fastapi import Request, HTTPException
from pymongo.collection import Collection




def getSlug(title: str) -> str:
    return title.lower().replace(" ", "-")


def getTokenFromRequest(req: Request) -> str:
    try:
        return req.headers.get("Authorization").split(" ")[1]
    except Exception as e:
        raise HTTPException(401, "Unprocessable authentification header")




def isUnique(collection: Collection, query: dict[str, any]) -> bool:
    """
    Check if a document with the given query exists in the collection.
    
    :param collection: The MongoDB collection to check.
    :param query: The query to match documents against.
    :return: True if no documents match the query, False otherwise.
    """
    return collection.count_documents(query) == 0