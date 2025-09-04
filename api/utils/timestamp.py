from datetime import datetime


def timestamp(date: datetime) -> str:
    return date.astimezone().isoformat()