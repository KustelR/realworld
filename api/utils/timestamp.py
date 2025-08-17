from datetime import datetime


def timestamp() -> str:
    return datetime.now().astimezone().isoformat() 