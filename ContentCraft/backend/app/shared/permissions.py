def can_manage_resource(user_id: int, owner_id: int) -> bool:
    # Demo permission check. Enforce tenant/role checks in production.
    return user_id == owner_id
