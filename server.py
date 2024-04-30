from flask import Flask
from flask import render_template
from flask import Response, make_response, request, send_from_directory, redirect, jsonify, url_for, flash
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from werkzeug.utils import secure_filename
from pymongo import MongoClient
import time
import os
import random
import hashlib
import urllib.parse
import time
import html
import json

app = Flask(__name__)
socket = SocketIO(app)

#DataBase
client = MongoClient("Server312",27017)
db = client["312Db"]
userdata = db["UserData"]
chat_collection = db["Chat"]
war_zone = db["War_Zone"]
b_list = db["Battle_List"]
onlineUsers = []
user_request = {}
UPLOAD_FOLDER = 'static/image/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
error_mess = ""

def getUserList(userData):
    users = []
    # users.append("corben")
    for i in userData.find({},{"_id":0, "username":1}):
        name =i['username']
        users.append(name)
    return users
    # return jsonify('users':users)
    
#Generate a Salt
def Saltgen(x):
    string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    chars=""
    for i in range(x):
        chars += (random.choice(string))
    return chars

#Battle Gen
def Characer_Gen():
    character = {"player1": {"Health": 100, "Damage": 8, "image": "static/crusader.png"},
                #  "player2": {"Health": 10, "Damage": 5, "image": "static/image/2.jpg"},
                #  "player3": {"Health": 10, "Damage": 5, "image": "static/image/3.jpg"},
                #  "player4": {"Health": 10, "Damage": 5, "image": "static/image/4.jpg"},
                #  "player5": {"Health": 10, "Damage": 5, "image": "static/image/5.jpg"},
                #  "player6": {"Health": 10, "Damage": 5, "image": "static/image/6.jpg"},
                #  "player7": {"Health": 10, "Damage": 5, "image": "static/image/7.jpg"},
                #  "player8": {"Health": 10, "Damage": 5, "image": "static/image/8.jpg"},
                #  "player9": {"Health": 10, "Damage": 5, "image": "static/image/9.jpg"},
                #  "player10": {"Health": 10, "Damage": 5, "image": "static/image/10.jpg"},
                #  "player11": {"Health": 10, "Damage": 5, "image": "static/image/11.jpg"},
                #  "player12": {"Health": 10, "Damage": 5, "image": "static/image/12.jpg"},
                #  "player14": {"Health": 10, "Damage": 5, "image": "static/image/13.jpg"},
                #  "player14": {"Health": 10, "Damage": 5, "image": "static/image/14.jpg"},
                 }
    return random.choice(list(character.values()))

#when / is url returns index.html contents as home page and also calls on css/js files
@app.route("/", methods=['GET'])
def home():
    return render_template('index.html')
 
# Battle Page Rendering
@app.route("/battle", methods=['GET'])
def BattlePage():
    #Checks Cookie and Auth if user exist
    if 'auth' in request.cookies and userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()}) and request.cookies.get('auth') != '':
        return render_template('battle.html', UserName = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})['username']) 
    else:
        return redirect('/')

@app.route("/war_zone", methods=['GET'])
def MultiPage():
    #Checks Cookie and Auth if user exist
    user = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
    res1 = war_zone.find_one({"player1": user['username']})
    res2  = war_zone.find_one({"player2": user['username']})
    if 'auth' in request.cookies and user and request.cookies.get('auth') != '' and (res1 is not None or res2 is not None):
        return render_template('warzone.html', UserName = user['username'])
    else:
        return redirect('/')

@app.route("/home", methods=['GET'])
def homePage():
    #Checks Cookie and Auth if user exist
    if 'auth' in request.cookies and userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()}) and request.cookies.get('auth') != '':
        user = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
        return render_template('home.html', UserName = user['username'], profile = user['profile_pic']) 
    else:
        return redirect('/')
    
@app.route("/profile", methods=['GET'])
def profilePage():
    #Checks Cookie and Auth if user exist
    if 'auth' in request.cookies and userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()}) and request.cookies.get('auth') != '':
        user = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
        return render_template('profile.html', UserName = user['username'], profile = user['profile_pic'], error = error_mess) 
    else:
        return redirect('/')
    
#Register for an account
@app.route("/register", methods=['POST'])
def register():
    #Get the credentials
    data = request.get_json()
    username = data.get('username')
    pw = data.get('password')
    pw_retype = data.get('retype')
    #Check for missing credentials
    if username == "" or pw == "" or pw_retype == "":
        return jsonify({'message': 'Credentials Missing'})
    #Check for Miss match password
    if pw != pw_retype:
        return jsonify({'message': 'Password Miss Match'})
    #Check if username already in use
    if userdata.find_one({"username": username}):
        return jsonify({'message': 'Username already in use'})
    #Generate user info
    salt = Saltgen(50)
    hashpass = hashlib.sha256((pw+salt).encode('utf-8')).hexdigest()
    user_info = {"username" : username, "password": hashpass,"salt": salt, "auth_token": '',"profile_pic":'static/image/default.png'}
    #Insert in DB
    userdata.insert_one(user_info)
    return jsonify({'message': 'Registration successful'})

#Login
@app.route("/login", methods=['POST'])
def login():
    #Get the credentials from form
    data = request.get_json()
    username = data.get('username')
    pw = data.get('password')
    if username == "" or pw == "":
        return jsonify({'message': 'Credentials Missing'})
    #Search database
    if userdata.find_one({"username": username}):
       #Get the credentials from Database
       authpass = userdata.find_one({"username": username})['password']
       salt = userdata.find_one({"username": username})['salt']
       #Generate new token
       hashpass = hashlib.sha256((pw+salt).encode('utf-8')).hexdigest()
       #Check PW
       if authpass == hashpass:
        #Update auth token
        auth_cookie = salt[15:40]
        hash_cookie = hashlib.sha256((auth_cookie).encode('utf-8')).hexdigest()
        userdata.update_one({"username": username, "password":hashpass},{"$set":{"auth_token": hash_cookie}})
        response = make_response(jsonify({'message': 'Login successful'}))
        response.set_cookie('auth', auth_cookie, httponly=True, max_age=7200)
        return response
       else:
           return jsonify({'message': 'Password or Username Incorrect'})
    else:
        return jsonify({'message': 'Password or Username Incorrect'})

@app.route("/add_battle", methods=['POST'])
def add_battle():
    user = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
    battle_id = Saltgen(8)
    if b_list.find_one({'player1': user['username']}) == None:
        b_list.insert_one({'player1': user['username'],'player1_profile': user['profile_pic'],'player2' : '','player2_profile': '','battle_id': battle_id})
        return jsonify({'message': 'Battle Added'})
    else:
        return jsonify({'message': 'Challenge Given'})

@app.route("/send_battle_list", methods=['GET'])
def send_battle():
    battle_list = []
    for i in b_list.find({},{ "_id": 0, "player1": 1, "player1_profile": 1 ,"player2": 1, "player2_profile": 1 ,"battle_id":1}):
        battle_list.append(i)
    response = make_response(jsonify(battle_list))
    response.status_code = 200
    response.mimetype = 'application/json'
    return response

@app.route("/add_challenger", methods=['POST'])
def add_challenger():
    user = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
    data = request.get_json()
    game_id = data.get('game_id')
    b_list.update_one({"battle_id": game_id},{"$set":{"player2": user['username'],"player2_profile": user['profile_pic']}})
    game = b_list.find_one({"battle_id": game_id})
    if b_list.find_one({"player1":user['username']}):
        b_list.delete_one({"player1":user['username']})
    player1char = Characer_Gen()
    player2char = Characer_Gen()
    battle = {"player1": game['player1'],"player1_profile": game['player1_profile'], "player1char": player1char,"player1health": player1char.get('Health'),
              "player2": game['player2'],"player2_profile": game['player1_profile'],"player2char": player2char,"player2health": player2char.get('Health'),
              "time": '',"p1move": False,"p2move": False}
    war_zone.insert_one(battle)
    return jsonify({'message': 'Challenge Given'})

# Find a ongoing battle
@app.route("/find_battle", methods=['POST'])
def findbattle():
    user = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
    res1 = war_zone.find_one({"player1": user['username']})
    res2  = war_zone.find_one({"player2": user['username']})
    if res1 is not None or res2 is not None:
        return jsonify({'message': 'War Found'})
    else:
        return jsonify({'message': 'No War'})
#LogOut
@app.route("/logout", methods=['POST'])
def Logout():
    #Checks auth cookie
    if 'auth' not in request.cookies:
        return jsonify({'message': 'You Have not Logged In'})
    else:
        user = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
        res1  = b_list.find_one({"player1": user['username']})
        if res1 is not None:
            b_list.delete_one({"player1":user['username']})
        userdata.update_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()},{"$set":{"auth_token": ''}})
        response = make_response(jsonify({'message': 'Logged Out Successful'}))
        response.set_cookie('auth', '', expires=0)
        return response

@app.route("/userList", methods=['GET'])
def getUserList():
    users = []    
    for i in userdata.find({},{"_id":0, "username":1}):
        users.append(i)
    response = make_response(jsonify(users))        
    return response

@app.route("/chat-messages", methods=['GET'])
def getChat():
    messages = []
    for i in chat_collection.find():
        i.pop("_id")
        messages.append(i)
    response = make_response(jsonify(messages))
    response.status_code = 200
    response.mimetype = 'application/json'
    return response

@app.route("/chat-messages", methods=['POST'])
def postChat():
    user = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
    username = user.get('username')
    data = request.get_json()
    message = data.get('message')
    message = html.escape(message)
    uid = random.randint(1,999999999)
    entry = {"id":uid,"username":username, "message":message, "type":"chat","upvote":[],"downvote":[],'profile': user['profile_pic']}
    chat_collection.insert_one(entry)
    response = make_response(jsonify({'message':'posted'}))
    response.status_code = 201
    return response

@app.route("/upvote", methods=['POST'])
def upvote():
    data = request.get_json()
    uid = data.get("id")
    username = data.get("username")
    upvotes = chat_collection.find_one({"id": uid})
    if username not in upvotes["upvote"]:
        upvotes = upvotes["upvote"]
        upvotes.append(username)
    else:
        upvotes = upvotes["upvote"]
    chat_collection.update_one({"id": uid},{"$set": {"upvote": upvotes}})
    response = make_response(jsonify({'message':'upvoted'}))
    response.status_code = 201
    return response

@app.route("/downvote", methods=['POST'])
def downvote():
    data = request.get_json()
    uid = data.get("id")
    username = data.get("username")
    downvotes = chat_collection.find_one({"id": uid})
    if username not in downvotes["downvote"]:
        downvotes = downvotes["downvote"]
        downvotes.append(username)
    else:
        downvotes = downvotes["downvote"]
    chat_collection.update_one({"id": uid},{"$set": {"downvote": downvotes}})
    response = make_response(jsonify({'message':'downvoted'}))
    response.status_code = 201
    return response

@app.route("/profile-pic", methods=['POST'])
def image_upload():
    # check if the user_image in the request
    if 'user_image' not in request.files:
        return redirect("/profile")
    # check if a file is seclected
    if request.files['user_image'].filename == '':
        return redirect("/profile")
    file = request.files['user_image']
    # check if its an allowed file (png, jpg, jpeg) 
    if file and allowed_file(file.filename):
        # gets the user for the file
        user = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})['username']
        # cleans the file to make it safe
        filename = user + "_" + secure_filename(file.filename)
        # saves file to server
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        # update user profile
        userdata.update_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()},{"$set":{"profile_pic": (app.config['UPLOAD_FOLDER']+filename)}})
        return redirect("/profile")
    
# @app.route("/getUser", methods=['GET'])
# def getUser():
#     data = request.get_json()
#     userchat= data.get('username')    
#     user = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()},{"username":userchat})
#     username = user['username']
#     if(username==userchat):
#         response = make_response(jsonify({'status':'match'}))
#         response.status_code = 200
#         response.mimetype = 'application/json'
#     else:
#         response = make_response(jsonify({'status':'nomatch'}))
#         response.status_code = 200
#         response.mimetype = 'application/json'
    
#     return response
def getUser(req):
    return userdata.find_one({"auth_token": hashlib.sha256((req.cookies.get('auth')).encode('utf-8')).hexdigest()})['username']

@app.route("/socket.io/", methods=['POST'])
def socket_connect():
    print("A socket was connected")

@socket.on('connect')
def handle_connect(sid = -1):
    user = getUser(request)
    onlineUsers.append(user)
    emit("onlineList",json.dumps(onlineUsers),broadcast=True)

@socket.on('disconnect')
def handle_disconnect():
    user = getUser(request)
    onlineUsers.remove(user)
    emit("onlineList",json.dumps(onlineUsers),broadcast=True)


@socket.on('chat')
def handleChat(data):
    profile = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})['profile_pic']
    username = getUser(request)
    message = data.get('message')
    message = html.escape(message)
    uid = random.randint(1,999999999)
    entry = {"id":uid,"username":username, "message":message, "type":"chat","upvote":[],"downvote":[], 'profile': profile}
    send = json.dumps(entry)
    chat_collection.insert_one(entry)
    emit('chat-event', send, broadcast=True)
    
    
# add n sniff after
@app.after_request
def add_nosniff(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'    
    return response
@app.route("/<path:folder>/<path:file>", methods=['GET'])
def style(folder, file):
    return send_from_directory(folder, file)
   
if __name__ =='__main__':
    app.run(host ='0.0.0.0', port=8080)