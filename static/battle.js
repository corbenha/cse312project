async function logout(){
    try{
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
          };
    }catch(error){
        console.error('Error',error);
    }
}
function home(){
    window.location.replace("/home");
}

async function add_battle(){
    try{
        const response = await fetch("/add_battle",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'X-Content-Type-Options': 'nosniff'
            }
          });
        const content = await response.json();
        var button = document.querySelector('.BattleButton');
        button.disabled = true;
        document.getElementById('Client_Message').textContent = content.message;
        setTimeout(function(){
            document.getElementById('Client_Message').textContent = "";
            button.disabled = false;
        }, 2000);
    }catch(error){
        console.error('Error',error);
    }
}

function chatMessageHTML(messageJSON) {
    var player1 = messageJSON.player1;
    var player1_profile = messageJSON.player1_profile;
    var player2 = messageJSON.player2;
    var player2_profile = messageJSON.player1_profile;
    var game_id = messageJSON.battle_id;
    var user = document.getElementById('Display_User').textContent
    if (player1 == user){
        return '<div class = "challengers"> <img src="'+player1_profile+'" alt="player_profile" class="player1_profile"> <p class="Challenger_name"><b>'+player1+'</b> is waiting for an Opponent</p><input type="hidden" id="match_id" value="'+game_id+'"></div>'
    }else if(player2 == ''){
        return '<div class="challengers"> <img src="' + player1_profile + '" alt="player_profile" class="player1_profile"> <p class="Challenger_name"><b>' + player1 + '</b> is waiting for an Opponent</p><button class="challengers_battle_button" onclick="add_battle_challenger(\'' + game_id + '\')">battle</button><input type="hidden" id="match_id" value="' + game_id + '"></div>';
    }else{
        return '<div class = "challengers"> <img src="'+player1_profile+'" alt="player1_profile" class="player1_profile"><p class="Challenger_name" id ="player1"><b>'+player1+'</b> vs </p><img src="'+player2_profile+'" alt="player2_profile" class="player2_profile"><p id="player2"><b>'+player2+'</b></p><button class="On_Going_button" disabled>On Going Battle</button><input type="hidden" id="match_id" value="'+game_id+'"></div>'
    }
}
function addMessageToChat(messageJSON) {
    const chatMessages = document.getElementById("Challenger_List");
    chatMessages.innerHTML += chatMessageHTML(messageJSON);
    chatMessages.scrollIntoView(false);
    chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight;
}

function clearChat() {
    const chatMessages = document.getElementById("Challenger_List");
    chatMessages.innerHTML = "";
}

async function send_battle_list() {
    try{
        const response = await fetch("/send_battle_list",{
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
    }catch(error){
        console.error("Error",error)
    }
}
async function add_battle_challenger(battle_id){
    try{
        const response = await fetch("/add_challenger",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                'X-Content-Type-Options': 'nosniff'},
            body: JSON.stringify({
                "game_id":battle_id
              })      
            });
            const content = await response.json();
    }catch(error){
        console.error("Error:", error);
    }
}
async function find_battle(){
    try{
        const response = await fetch("/find_battle",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                'X-Content-Type-Options': 'nosniff'},
            });
            const content = await response.json();
        if(content.message == "War Found"){
            window.location.replace("/war_zone");
        }
    }catch(error){
        console.error("Error:", error);
    }
}
setInterval(send_battle_list, 1000);
setInterval(find_battle, 1000);