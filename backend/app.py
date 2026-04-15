import os
import re
import secrets
import threading

from flask import Flask, jsonify, redirect, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from config import load_config

config = load_config()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": config.cors_origins}})

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=config.default_rate_limits,
)

_CODE_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
_DEFAULT_CODE_LENGTH = 8  # must be > 5 per requirement

# No DB mode: keep mappings in memory.
# Note: this means short links won't survive restarts and won't work across multiple workers/instances.
_code_to_url = {}
_url_to_code = {}
_map_lock = threading.Lock()


def build_short_url(short_code):
    return f"{config.app_base_url}/{short_code}"


def create_code(original_url):
    code_length = int(os.getenv("SHORT_CODE_LENGTH", str(_DEFAULT_CODE_LENGTH)))
    if code_length <= 5:
        code_length = _DEFAULT_CODE_LENGTH

    while True:
        code = "".join(secrets.choice(_CODE_ALPHABET) for _ in range(code_length))
        if code not in _code_to_url:
            return code


def check_url(original_url):
    with _map_lock:
        existing = _url_to_code.get(original_url)
        if existing:
            return build_short_url(existing)

        code = create_code(original_url)
        _code_to_url[code] = original_url
        _url_to_code[original_url] = code
        return build_short_url(code)


def code_to_url(code):
    with _map_lock:
        return _code_to_url.get(code)


@app.route("/generate", methods=["GET", "POST"])
@limiter.limit(config.shorten_rate_limit)
def shorten_url():
    original_url = request.args.get("url", "").strip()
    if not original_url:
        return jsonify({"message": "Please Enter an URL"}), 200
    if len(original_url) < 20:
        return jsonify({"message": "Link too short to be shortened"}), 200

    pattern = r"^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$"
    match_pattern = re.match(pattern, original_url) is not None
    if match_pattern:
        shortened_url = check_url(original_url)
        return jsonify({"message": shortened_url}), 200

    return jsonify({"message": "invalid URL"}), 200


@app.route("/<path:code>", methods=["GET", "POST"])
def redirect_to_url(code):
    original_url = code_to_url(code)
    if not original_url:
        return "<h1>INVALID URL</h1>", 404
    return redirect(original_url)


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=False)
