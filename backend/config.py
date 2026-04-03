import os
from dataclasses import dataclass
from typing import List, Union
from urllib.parse import quote_plus

from dotenv import load_dotenv

load_dotenv()


def _get_env(name, default=None, required=False):
    value = os.getenv(name, default)
    if required and (value is None or str(value).strip() == ""):
        raise ValueError(f"Missing required environment variable: {name}")
    return value


def _build_mongo_uri():
    direct_uri = _get_env("MONGO_URI")
    if direct_uri:
        return direct_uri

    username = _get_env("MONGO_USERNAME")
    password = _get_env("MONGO_PASSWORD")
    cluster = _get_env("MONGO_CLUSTER")
    options = _get_env(
        "MONGO_OPTIONS",
        "?retryWrites=true&w=majority&appName=Cluster0",
    )

    if username and password and cluster:
        return (
            f"mongodb+srv://{quote_plus(username)}:{quote_plus(password)}"
            f"@{cluster}/{options}"
        )

    return None


def _parse_cors_origins():
    raw_value = _get_env("CORS_ALLOWED_ORIGINS", "*")
    if raw_value.strip() == "*":
        return "*"
    return [origin.strip() for origin in raw_value.split(",") if origin.strip()]


@dataclass(frozen=True)
class AppConfig:
    app_base_url: str
    mongo_uri: str
    database_name: str
    collection_name: str
    secret_key: str
    cors_origins: Union[str, List[str]]
    default_rate_limits: List[str]
    shorten_rate_limit: str


def load_config():
    app_base_url = _get_env("APP_BASE_URL", required=True).rstrip("/")
    mongo_uri = _build_mongo_uri()

    if not mongo_uri:
        raise ValueError(
            "Missing MongoDB configuration. Set MONGO_URI or "
            "MONGO_USERNAME, MONGO_PASSWORD, and MONGO_CLUSTER."
        )

    return AppConfig(
        app_base_url=app_base_url,
        mongo_uri=mongo_uri,
        database_name=_get_env("MONGO_DATABASE_NAME", "url_db"),
        collection_name=_get_env("MONGO_COLLECTION_NAME", "urls"),
        secret_key=_get_env("SECRET_KEY", required=True),
        cors_origins=_parse_cors_origins(),
        default_rate_limits=[
            limit.strip()
            for limit in _get_env(
                "DEFAULT_RATE_LIMITS",
                "200 per day,50 per hour",
            ).split(",")
            if limit.strip()
        ],
        shorten_rate_limit=_get_env("SHORTEN_RATE_LIMIT", "10 per minute"),
    )
