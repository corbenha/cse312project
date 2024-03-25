
const randomCrusaderStuff = [
    "Crusader armor evolved over time, starting with chainmail shirts and helmets in the early Crusades, and later incorporating plate armor during the later Crusades.",
    "Chainmail, consisting of interlocking metal rings, was a common form of protection for Crusaders, providing flexibility and coverage against slashing attacks.",
    "Crusader helmets varied in design but often included nasal helmets, which featured a nose guard for facial protection, or the iconic 'Great Helm,' a fully enclosed helmet with eye slits and a flat top.",
    "Plate armor became more prevalent among Crusaders in the 12th and 13th centuries, offering superior protection against thrusting attacks and ranged weapons like arrows.",
    "Crusader armor was often adorned with religious symbols such as crosses, indicating the wearer's devotion to Christianity and their participation in holy wars.",
    "Shields were essential pieces of Crusader armor, providing additional protection in battle. They were typically made of wood, reinforced with metal rims and bosses for added durability.",
    "Crusader knights sometimes wore surcoats over their armor, which displayed their heraldic symbols and helped identify them on the battlefield.",
    "Crusader armor was expensive and typically only affordable for nobles and wealthier knights, limiting its availability to the upper echelons of Crusader society.",
    "The weight of Crusader armor varied depending on its composition and design, with full suits of plate armor weighing anywhere from 40 to 60 pounds.",
    "Despite advancements in armor technology, Crusaders still faced significant risks on the battlefield, including injury from blunt force trauma, exhaustion, and the limitations of their protective gear against certain weapons."
  ];

function randomText() {
    document.getElementById("randomText").innerHTML = "<br/>"+randomCrusaderStuff[Math.floor(Math.random()*9)]
}
// format of user list display
function userListHTML(userJSON) {
    const username = userJSON.username;
    let userHTML = "<br><button onclick='requestBattle(\"" + username + "\")'>Battle</button> ";
    userHTML += "<span id='userName' style='height:2vh'>" + username + "</span>";
    // style="height: 2vh"
    return userHTML;
}

// adds new users who to list
function addUserToList(userJSON) {
    const user = document.getElementById("userList");
    user.innerHTML += userListHTML(userJSON);
    user.scrollIntoView(false);
    user.scrollTop = user.scrollHeight - user.clientHeight;
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

function welcome() {
    document.addEventListener("keypress", function (event) {
        if (event.code === "Enter") {
            sendChat();
        }
    });
    document.getElementById("chat-text-box").focus();
    updateUserList();
    updateChat();
    setInterval(updateChat, 5000);
}

// let messageHTML = "<br><button class ='requestBattle' onclick='requestBattle(\"" + username + "\")'>Battle</button> ";
// let messageHTML = "<br><button class ='requestBattle' onclick='requestBattle(\"" + username + "\")'>Battle</button> ";
//     messageHTML += "<span id='chat-messages'>"+username+ " | " + message + "</span>";
function chatMessageHTML(messageJSON) {
    const username = messageJSON.username;
    const message = messageJSON.message;
    let messageHTML = "<br><button onclick='request_battle(\"" + username + "\")'>Battle</button> ";
    messageHTML += "<span id='userName' >" + username + ":"+ message+"</span>";
    return messageHTML;
    setInterval(updateUserList, 5000);
}


 function chatMessageHTML(messageJSON) {
    var username = messageJSON.username;
    var message = messageJSON.message;    
    let messageHTML = "<br><br><button class='chat-username'>" +username+"</button>";
    messageHTML +="<span class='chat-messages'>"+message+"</span><button onclick='battle()' class='chat-battle-button'>Battle "+username+"</button>";
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

function battle_redirect() {
    window.location.replace("/battle");
}
