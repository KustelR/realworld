from dateutil import parser

def getAuthorNewestSortPipeline(authorList):
    print("here", authorList)
    pipeline = []
    pipeline.append({
        "$addFields": {
            "followed": {
                "$cond": {
                    "if": {"$in": ["$author.username", authorList]},
                    "then": 1,
                    "else": 0
                }
        }}
    })
    pipeline.append({
        "$sort": {
            "followed": -1,
            "updatedAt": -1,
        }
    })
    pipeline.append({"$unset": ["followed"]})
    return pipeline


def getNewestSortPipeline():
    pipeline = []

    pipeline.append({
        "$sort": {
            "updatedAt": -1
        }
    })

    return pipeline