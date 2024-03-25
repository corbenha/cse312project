from flask import Flask
from flask import render_template
from flask import Response, make_response, request, send_from_directory, redirect, jsonify
from pymongo import MongoClient
import random
import hashlib
import urllib.parse
import time
import html

app = Flask(__name__)
app.config['DEBUG'] = True

#DataBase
client = MongoClient("Server312",27017)
db = client["312Db"]
userdata = db["UserData"]
chat_collection = db["Chat"]
singlebattle = db["Single_Arena"]
c_list = db["Challenger_List"]
multibattle = db["Multi_Arena"]

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
    if 'auth' in request.cookies and userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()}):
        return render_template('battle.html', UserName = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})['username']) 
    else:
        return redirect('/')

@app.route("/multi", methods=['GET'])
def MultiPage():
    #Checks Cookie and Auth if user exist
    if 'auth' in request.cookies and userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()}):
        return render_template('multi.html', UserName = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})['username']) 
    else:
        return redirect('/')

@app.route("/home", methods=['GET'])
def homePage():
    #Checks Cookie and Auth if user exist
    if 'auth' in request.cookies and userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()}):
        return render_template('home.html', UserName = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})['username']) 
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
    token = hashlib.sha256((salt[15:40]).encode('utf-8')).hexdigest()
    user_info = {"username" : username, "password": hashpass,"salt": salt, "auth_token": token}
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
        token = userdata.find_one({"username": username, "password":authpass})['salt'][15:40]
        response = make_response(jsonify({'message': 'Login successful'}))
        response.set_cookie('auth', token, httponly=True, max_age=7200)
        return response
       else:
           return jsonify({'message': 'Password or Username Incorrect'})
    else:
        return jsonify({'message': 'Password or Username Incorrect'})

# Find a ongoing battle
@app.route("/find_battle", methods=['POST'])
def findbattle():
    if 'auth' in request.cookies and singlebattle.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()}):
        data = singlebattle.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
        return jsonify({'message': 'Battle Found',
                        "player_image": data['player_image'],"player_health":data['player_health'],"player_damage":data['player_damage'],"player_name": data["player_name"],
                        "bot_image":data['bot_image'],"bot_health":data['bot_health'],"bot_damage":data['bot_damage'],"bot_name": data["bot_name"]
                        })
    else:
        return jsonify({'message': 'No battles found'})

# Generate a Battle
@app.route("/gen_battle", methods=['POST'])
def generateBattle():
    # check to see if battle exist
    if 'auth' in request.cookies and singlebattle.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()}):
        # find the battle
        data = singlebattle.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
        # return battle data
        return jsonify({'message': 'Ongoing Battle',"player_image": data['player_image'],"player_health":data['player_health'],"player_damage":data['player_damage'],"player_name": data["player_name"],
                "bot_image":data['bot_image'],"bot_health":data['bot_health'],"bot_damage":data['bot_damage'],"bot_name": data["bot_name"]})
    else:
        # create battle 
        player_name = userdata.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})['username']
        # get characters object
        player = Characer_Gen()
        bot = Characer_Gen()
        # create battle data
        # store battle data
        singlebattle.insert_one({"player_image": player['image'],"player_health":player['Health'],"player_damage":player['Damage'],"player_name": player_name,
                "bot_image":bot['image'],"bot_health": bot['Health'],"bot_damage": bot['Damage'],"bot_name": "Bot Bob", 
                "match_mess": "Get Ready For War", "auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
        # return battle data
        return jsonify({"player_image": player['image'],"player_health":player['Health'],"player_damage":player['Damage'],"player_name": player_name,
                "bot_image":bot['image'],"bot_health":bot['Health'],"bot_damage":bot['Damage'],"bot_name": "Bot Bob"
                })

# Generate a Battle
@app.route("/update_single_battle", methods=['POST'])
def updateBattle_single():
    # find battle data
    if 'auth' in request.cookies and singlebattle.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()}):
        data = singlebattle.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
        if data['bot_health'] <= 0:
            singlebattle.delete_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
            return jsonify({"bot_health":data['bot_health'], "player_health":data['player_health'],"mess":"You Win"})
        elif data['player_health'] <= 0:
            singlebattle.delete_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
            return jsonify({"bot_health":data['bot_health'], "player_health":data['player_health'],"mess":"You Lose, Bot Win"})
        else:
            return jsonify({"bot_health":data['bot_health'], "player_health":data['player_health'],"mess":"Battle"})

    else:
        return jsonify({"mess":"No Battle"})

@app.route("/single_battle_gameplay", methods=['POST'])
def SingleBattleGameplay():
    data = request.get_json()
    input = data.get('input')
    match_data = singlebattle.find_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()})
    num= random.randint(0,1)
    # input options
    if input == "attack":
        # defense if less than 50
        if num == 0:
            bot_health = match_data['bot_health'] - (match_data['player_damage']/2)
            if bot_health <= 0:
                bot_health = 0
            singlebattle.update_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()},{"$set":{"bot_health":bot_health}})
            return jsonify({"message": "You attacked, Bot Defended"})
        # attack if greater than 50 
        elif num == 1:
            bot_health = match_data['bot_health'] - match_data['player_damage']
            player_health = match_data['player_health'] - match_data['bot_damage']
            if bot_health <= 0:
                bot_health = 0
            if player_health <= 0:
                player_health = 0
            singlebattle.update_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()},{"$set": {"bot_health":bot_health, "player_health":player_health}})
            return jsonify({"message": "You attacked, Bot Attacked"})
    elif input == "defend":
        # attack if greater than 50 
        if num == 1:
            player_health = match_data['player_health'] - (match_data['bot_damage']/2)
            # Check if health is less than 0
            if player_health <= 0:
                player_health = 0
            singlebattle.update_one({"auth_token": hashlib.sha256((request.cookies.get('auth')).encode('utf-8')).hexdigest()},{"$set":{"player_health":player_health}})
            return jsonify({"message": "You Defendded, Bot Attacked"})
        else:
            return jsonify({"message": "You Defendded, Bot Defended"})

#LogOut
@app.route("/logout", methods=['POST'])
def Logout():
    #Checks auth cookie
    if 'auth' not in request.cookies:
        return jsonify({'message': 'You Have not Logged In'})
    else:
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
    for i in chat_collection.find({},{"_id":0,"username":1,"message":1}):
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
    entry = {"username":username, "message":message, "type":"chat"}
    chat_collection.insert_one(entry)
    response = make_response(jsonify({'message':'posted'}))
    response.status_code = 201
    return response

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

    
# add n sniff after
@app.after_request
def add_nosniff(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'    
    return response
@app.route("/<path:folder>/<path:file>", methods=['GET'])
def style(folder, file):
    return send_from_directory(folder, file)
   
if __name__ =='__main__':
    app.run(host ='0.0.0.0', port=8080, debug=True)
