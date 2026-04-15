import os
from dataclasses import dataclass
from typing import List, Union

from dotenv import load_dotenv

load_dotenv()


def _get_env(name, default=None, required=False):
    value = os.getenv(name, default)
    if required and (value is None or str(value).strip() == ""):
        raise ValueError(f"Missing required environment variable: {name}")
    return value


def _parse_cors_origins():
    raw_value = _get_env("CORS_ALLOWED_ORIGINS", "*")
    if raw_value.strip() == "*":
        return "*"
    return [origin.strip() for origin in raw_value.split(",") if origin.strip()]


@dataclass(frozen=True)
class AppConfig:
    app_base_url: str
    secret_key: str
    cors_origins: Union[str, List[str]]
    default_rate_limits: List[str]
    shorten_rate_limit: str


def load_config():
    return AppConfig(
        app_base_url=_get_env("APP_BASE_URL", required=True).rstrip("/"),
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
