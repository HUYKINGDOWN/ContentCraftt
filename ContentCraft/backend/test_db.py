
from sqlalchemy import text
from app.core.database import engine

try:
    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT @@SERVERNAME AS server_name, DB_NAME() AS database_name")
        )
        row = result.fetchone()

        print("Ket noi SQL Server thanh cong!")
        print(f"Server: {row.server_name}")
        print(f"Database: {row.database_name}")

except Exception as exc:
    print("Ket noi SQL Server that bai!")
    print(exc)
