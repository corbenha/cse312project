const { json } = require("express");

var socket = null;

function updateOnlineList(data) {
    html = ""
    data = JSON.parse(data)
    for(const username of data){
        html += '<p style="margin: 1.5%;">'+username+'</p>'
    }
    const list = document.getElementById("onlineList");
    list.innerHTML = html
}

function leaderboard_list(data) {
    html = ""
    data = JSON.parse(data)
    for(const username of data){
        html += '<p style="margin: 1.5%;">'+username+'</p>'
    }
    const list = document.getElementById("leaderboard_list");
    list.innerHTML = html
}

async function updateUserList() {

    const response = await fetch("/userList",{
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            'X-Content-Type-Options': 'nosniff'
          }});
        
        const content = await response.json();
        for(const user of content){
            addUserToList(user);
        }    
}

function createSocket(){
    socket = io();
        socket.on('connect',function(){
            socket.emit("create-connection")
        });
        socket.on("chat-event", (data) => {
            addMessageToChat(JSON.parse(data))
        });
        socket.on("onlineList", (data) => {
            updateOnlineList(data)
        });
        socket.on("leaderboard", (data) => {
            leaderboard_list(data)
        });
}

function welcome() {
    document.addEventListener("keypress", function (event) {
        if (event.code === "Enter") {
            sendChat();
        }
    });
    document.getElementById("chat-text-box").focus();
    updateUserList();
    updateChat();
    // setInterval(updateChat, 5000);
    createSocket();
}
function chatMessageHTML(messageJSON) {
    var username = messageJSON.username;
    var message = messageJSON.message;    
    var upvote = messageJSON.upvote.length;
    if(upvote == 0){upvote = ""}
    var downvote = messageJSON.downvote.length;
    if(downvote == 0){downvote = ""}
    var uid = messageJSON.id;
    var profile = messageJSON.profile;
    let messageHTML = '<div class="chat_message"> <img src="' + profile + '"><button class="user_name" disabled>' + username + '</button><button class="user_message" disabled>' + message + '</button><button onclick="upvote(' + uid + ', \'' + username + '\')" class="chat-upvote">^</button><button onclick="downvote(' + uid + ', \'' + username + '\')" class="chat-downvote">' + downvote + ' v</button></div>'; 
    return messageHTML;   
}
function addMessageToChat(messageJSON) {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML += chatMessageHTML(messageJSON);
    chatMessages.scrollIntoView(false);
    chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight;
}

async function sendChat(){
    // get text from chat box
    var chatTextBox = document.getElementById("chat-text-box").value
      
    // create response based on what is expected at server chat messages
    if(socket){
        socket.emit("chat",{message:chatTextBox})
        document.getElementById("chat-text-box").value = "";
    }else{
        const response = await fetch("/chat-messages",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'X-Content-Type-Options': 'nosniff'},
                body: JSON.stringify({'message': chatTextBox})
        }).then((response)=>{return response.json()}).then((content)=>{
            if(content.message == "posted"){
            document.getElementById("chat-text-box").value = "";}    
        });   
    }
}

async function updateChat() {
       const response = await fetch("/chat-messages",{
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            'X-Content-Type-Options': 'nosniff'}        
        });
        clearChat();
        const content = await response.json();
        for(const message of content){
            addMessageToChat(message);
        }
}

function clearChat() {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = "";
}

async function logout(){
    const response = await fetch("/logout",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'X-Content-Type-Options': 'nosniff'
      },
    });
    const content = await response.json();
    console.log(response.json.message)
    if (content.message == 'Logged Out Successful'){
      window.location.replace("/");
      document.getElementById('LogOutMessage').textContent = content.message;
    }
  }

  
async function upvote(uid, username){
    const response = await fetch("/upvote",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-Content-Type-Options': 'nosniff'
        },
        body: JSON.stringify({"id": uid, "username": username})
      });
  }
  
async function downvote(uid, username){
    const response = await fetch("/downvote",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-Content-Type-Options': 'nosniff'
        },
        body: JSON.stringify({"id": uid, "username": username})
      });
    }

function battle_redirect() {
    window.location.replace("/battle");
}
function profile_redirect() {
    window.location.replace("/profile");
}