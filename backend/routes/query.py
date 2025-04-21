from fastapi import APIRouter, HTTPException, Request
from schemas import QueryRequest, QueryResponse, QueryListResponse
from utils.llm_client import get_llm_response
from utils.redis_client import save_query_to_redis, get_all_queries, clear_query_history
from utils.text_cleaner import remove_think_tags

router = APIRouter()

@router.post("/ask", response_model=QueryResponse)
async def ask_question(request: Request, body: QueryRequest):
    try:
        session_id = request.headers.get('X-Session-ID') or request.state.session_id
        print(f"[DEBUG] Initiating search for: {session_id}")
        answer = await get_llm_response(body.question)
        answer = remove_think_tags(answer)
        save_query_to_redis(session_id, body.question, answer)

        # Debugging output
        print(f"[DEBUG] Redis response for session {session_id}:", answer)
        return QueryResponse(response=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=QueryListResponse)
async def get_query_history(request: Request):
    try:
        session_id = request.headers.get('X-Session-ID') or request.state.session_id
        queries = get_all_queries(session_id)
        # Debugging output
        print(f"[DEBUG] Redis response for session {session_id}:", len(queries))

        if not isinstance(queries, list):
            queries = []

        return QueryListResponse(queries=queries)
    except Exception as e:
        print("Error in /history:", e)
        return QueryListResponse(queries=[])

@router.delete("/clear-history")
async def clear_query_history_route(request: Request):
    try:
        session_id = request.headers.get('X-Session-ID') or request.state.session_id
        cleared = clear_query_history(session_id)
        print(f" Cleared query history for session {session_id}")
        return {"success": cleared}
    except Exception as e:
        print("Error clearing history:", e)
        raise HTTPException(status_code=500, detail="Failed to clear history")