import json
import os

from redis import Redis
from datetime import datetime, timedelta

redis_host = os.getenv("REDIS_HOST")
redis_port = os.getenv("REDIS_PORT")
redis_client = Redis(host=redis_host, port=redis_port, db=0, decode_responses=True)

EXPIRATION_TIME_SECONDS = 600  # 10 minutes

def save_query_to_redis(session_id: str, question: str, answer: str):
    key = f"queries:{session_id}"
    entry = {
        "question": question,
        "answer": answer,
        "timestamp": datetime.utcnow().isoformat()
    }
    redis_client.lpush(key, json.dumps(entry))
    redis_client.expire(key, EXPIRATION_TIME_SECONDS)  # Set expiration time for the key

def get_all_queries(session_id: str) -> list[dict]:
    key = f"queries:{session_id}"
    entries = redis_client.lrange(key, 0, -1)
    parsed_entries = [json.loads(entry) for entry in entries]

    # Sort by timestamp (ascending)
    try:
        parsed_entries.sort(key=lambda x: x.get("timestamp", ""))
    except Exception as e:
        print("Failed to sort query history by timestamp:", e)

    return parsed_entries

def clear_query_history(session_id: str) -> bool:
    key = f"queries:{session_id}"
    return redis_client.delete(key) > 0