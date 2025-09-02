from dateutil import parser

def getAuthorPipeline(authorList):
    pipeline = []

    pipeline.append({
        "$addFields": {
            "sortFactor": "$author.username"
        }
    })
    pipeline.append({
        "$addFields": {
            "sortPriority": {
                "$switch": {
                    "branches": [{
                        "case": {
                            "$in": ["$sortFactor", authorList]
                        },
                        "then": 2
                },
                {
                    "case": { "not": {
                            "$in": ["$sortFactor", authorList]
                    }},
                    "then": 1
                }
                ]}
            }}})
    pipeline.append({"$sort": {
        "sortPriority": -1
    }})
    pipeline.append({"$unset": ["sortPriority", "sortFactor"]})
    return pipeline


def newestSortPipeline():
    pipeline = []

    pipeline.append({
        "$addField": {
            "timestamp":
                parser.parse()
        }
    })

    return pipeline