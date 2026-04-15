import base64
import hashlib
import hmac
import os
import re
import zlib

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


def build_short_url(short_code):
    return f"{config.app_base_url}/{short_code}"


def _strip_padding(value):
    return value.rstrip("=")


def _restore_padding(value):
    return value + ("=" * (-len(value) % 4))


def create_code(original_url):
    compressed_url = zlib.compress(original_url.encode("utf-8"), level=9)
    encoded_payload = _strip_padding(
        base64.urlsafe_b64encode(compressed_url).decode("ascii")
    )
    signature = hmac.new(
        config.secret_key.encode("utf-8"),
        encoded_payload.encode("ascii"),
        hashlib.sha256,
    ).digest()[:6]
    encoded_signature = _strip_padding(
        base64.urlsafe_b64encode(signature).decode("ascii")
    )
    return f"{encoded_signature}.{encoded_payload}"


def check_url(original_url):
    return build_short_url(create_code(original_url))


def code_to_url(code):
    try:
        encoded_signature, encoded_payload = code.split(".", 1)
        expected_signature = hmac.new(
            config.secret_key.encode("utf-8"),
            encoded_payload.encode("ascii"),
            hashlib.sha256,
        ).digest()[:6]
        provided_signature = base64.urlsafe_b64decode(
            _restore_padding(encoded_signature)
        )
        if not hmac.compare_digest(provided_signature, expected_signature):
            return None

        compressed_url = base64.urlsafe_b64decode(_restore_padding(encoded_payload))
        return zlib.decompress(compressed_url).decode("utf-8")
    except Exception:
        return None


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
