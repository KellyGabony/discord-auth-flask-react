import datetime
import time
import jwt
from flask import Flask
from flask import request,redirect,make_response,jsonify
from flask_cors import CORS, cross_origin
import requests
app = Flask(__name__)
cors = CORS(app)
API_ENDPOINT = 'https://discord.com/api/v10'
# PUT HERE CLIENT ID AND CLIENT SECRET FROM YOUR DISCORD APPLICATION
CLIENT_ID = ''
CLIENT_SECRET = ''
REDIRECT_URI = 'http://localhost:5000/login'

def exchange_code(code):
  data = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': REDIRECT_URI
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  r = requests.post('%s/oauth2/token' % API_ENDPOINT, data=data, headers=headers)
  r.raise_for_status()
  print(r.json())
  return r.json()



def get_secret(tokens):
    return jwt.encode(tokens, "secret", algorithm="HS256")

def decode_secret(secret):
    return jwt.decode(secret, "secret", algorithms=["HS256"])


@app.route('/login')
def login():
    code = (request.args.get('code'))
    tokens = exchange_code(code)
    response = make_response(redirect("http://localhost:3000/login"))
    response.set_cookie("x-access-token",get_secret(tokens),tokens["expires_in"])
    response.set_cookie("x-refresh-token",get_secret({"date":str((datetime.datetime.now() + datetime.timedelta(days=5)).date())}),tokens["expires_in"])
    return response

@app.route('/test')
@cross_origin(origins=["http://localhost:3000"])
def test():
    print(request)
    response = make_response("Success")
    response.headers.add('Access-Control-Allow-Headers', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    print(request.cookies.get('x-refresh-token'))
    return response

@app.route('/user')
@cross_origin(origins=["http://localhost:3000"])
def get_user():
    try:
        access_token = decode_secret((request.cookies.get('x-access-token')))['access_token']
        user = requests.get('https://discord.com/api/v10/oauth2/@me',headers={
        'Content-Type': 'application/json',
        "Authorization" :"Bearer "+access_token
      }).json()
        user_data = {"status":"success","avatar": "https://cdn.discordapp.com/avatars/" + user['user']['id'] + "/" + user['user'][
            'avatar'] + ".webp", "username": user['user']['username'] + '#' + user['user']['discriminator']}
    except:
        user_data = {"status":"exception"}
    response = make_response(jsonify(user_data))
    response.headers.add('Access-Control-Allow-Headers', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=True)