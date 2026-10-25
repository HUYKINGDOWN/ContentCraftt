import hashlib
import hmac
try:
    import bcrypt
except ImportError:
    bcrypt = None


def hash_password(password: str) -> str:
    if bcrypt:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, hashed: str | None) -> bool:
    if not hashed:
        return False
    if hashed.startswith("$2b$") or hashed.startswith("$2a$"):
        if bcrypt:
            try:
                return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
            except Exception:
                return False
    # SHA256 check fallback
    sha_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return hmac.compare_digest(sha_hash, hashed)
