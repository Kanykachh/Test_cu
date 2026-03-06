import os

import mysql.connector
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Users API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_config() -> dict:
    password = os.getenv("MYSQL_PASSWORD") or os.getenv("MYSQL_ROOT_PASSWORD")
    config = {
        "host": os.getenv("MYSQL_HOST", "mysql"),
        "database": os.getenv("MYSQL_DATABASE", "ynov_ci"),
        "user": os.getenv("MYSQL_USER", "root"),
        "password": password,
        "port": int(os.getenv("MYSQL_PORT", "3306")),
        "connection_timeout": 5,
    }

    missing = [key for key, value in config.items() if key != "port" and key != "connection_timeout" and not value]
    if missing:
        raise HTTPException(
            status_code=500,
            detail=f"Missing database configuration: {', '.join(missing)}",
        )

    return config


@app.get("/")
def read_root() -> dict:
    return {"message": "Users API is running"}


@app.get("/health")
def read_health() -> dict:
    return {"status": "ok"}


@app.get("/users")
def get_users() -> dict:
    try:
        connection = mysql.connector.connect(**get_db_config())
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, nom, email, created_at FROM utilisateur")
        records = cursor.fetchall()
    except mysql.connector.Error as exc:
        raise HTTPException(status_code=500, detail=f"Database error: {exc}") from exc
    finally:
        if "cursor" in locals():
            cursor.close()
        if "connection" in locals() and connection.is_connected():
            connection.close()

    return {"utilisateurs": records}
