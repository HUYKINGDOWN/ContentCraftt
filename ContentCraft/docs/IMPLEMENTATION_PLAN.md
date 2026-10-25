# Implementation plan
1. Run demo via Docker Compose and verify `/api/health`.
2. Replace mock AI adapters with a provider implementation and environment-managed credentials.
3. Add user ownership, JWT/OAuth security, role-based access and password hashing with Argon2/bcrypt.
4. Add foreign keys, constraints, Alembic migrations and repository tests.
5. Add upload validation/storage lifecycle and background queue for long-running jobs.
6. Integrate platform publishing OAuth, retries and audit logs.
7. Add frontend routing, forms, pagination, accessibility and end-to-end tests.
