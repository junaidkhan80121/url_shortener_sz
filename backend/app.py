from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
import hashlib
from pymongo import MongoClient
import re
from dotenv import load_dotenv
import os
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from pymongo.server_api import ServerApi
load_dotenv()

app = Flask(__name__)
CORS(app)
DB_PASS = os.getenv("DB_PASSKEY")
MONGO_DB_URI = "mongodb+srv://khanjunaid80121:"+DB_PASS+"@cluster0.exfs3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

limiter = Limiter(
    get_remote_address,  # Rate limit by client IP address
    app=app,
    default_limits=["200 per day", "50 per hour"]
)


def connect_to_db():
    try:
        client = MongoClient(MONGO_DB_URI, server_api=ServerApi('1'))
        db = client["url_db"]
        collection = db["urls"]
        return collection
    except Exception as e:
        print("Error in connecting to database"+str(e))
    
## This method converts original url to shortened url
def check_url(original_url):
    try:
        collection = connect_to_db()
        row = collection.find_one({"$or": [{"original_url": original_url}, {"shortened_url": original_url}]})
        if row==None:
            return create_code(original_url)
        else:
            return row['shortened_url']
    except Exception as e:
        print("Error in processing",e)
        return "Error in processing"+str(e)
    
##this helper method generates a unique shortened code for every different url
def create_code(original_url):
    try:
        collection = connect_to_db()
        #hexdigest converts object to string
        #and blake2b takes key length in bytes so setting digest_size to 2 will give an output length of 4 characters
        shortened_url = hashlib.blake2b(str(original_url).encode(),key=os.getenv("SECRET_KEY").encode(), digest_size= 4).hexdigest()
        url_exists_in_db = collection.find_one({"shortened_url":shortened_url})
        shortened_url="http://localhost:5000/"+shortened_url
        collection.insert_one({"original_url":original_url,"shortened_url":shortened_url})
        return shortened_url
        
    except Exception as e:
        #print(e)
        return "Error in executing query"

##this method converts shortened url back to original URL
def code_to_url(code):
    try:
        collection = connect_to_db()
        row = collection.find_one({"shortened_url":code})
        if row==None:
            return "INVALID URL"
        else:
            return row['original_url']
    except Exception as e:
        return "Error in connecting database"+str(e)
    


@app.route("/generate",methods=["GET","POST"])
@limiter.limit("10 per minute")
def shorten_url():
    original_url = request.args.get('url')
    if not original_url:
        return jsonify({"message":"Please Enter an URL"}), 200
    if len(original_url)<20:
        return jsonify({"message":"Link too short to be shortened"}), 200
    pattern = r'^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$'
    match_pattern = re.match(pattern, original_url) is not None
    if match_pattern:
        shortend_url = check_url(original_url)
        return jsonify({"message":shortend_url}), 200
    return jsonify({"message":"invalid URL"}), 200


@app.route("/<code>", methods=["GET","POST"])
#@limiter.limit("10 per minute")
def redirect_to_url(code):
    original_url = code_to_url("http://localhost:5000/"+code)
    #print("Original URL:",original_url)
    if original_url =="INVALID URL":
        return f"<h1>{original_url}</h1>" , 200
    else:
        return redirect(original_url)#,300


if __name__=='__main__':
    app.run(debug=False)