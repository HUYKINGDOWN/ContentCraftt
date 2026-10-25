import hashlib

def test_demo_password_hash_is_deterministic():
    password = "demo-password"
    assert hashlib.sha256(password.encode()).hexdigest() == hashlib.sha256(password.encode()).hexdigest()
