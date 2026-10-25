from fastapi import HTTPException

def not_found(entity: str):
    return HTTPException(status_code=404, detail=f"{entity} not found")
