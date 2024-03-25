async function find_battle(){
    const response = await fetch("/find_battle",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-Content-Type-Options': 'nosniff'
        },
    });
    const content = await response.json();
    console.log(content.message);
    if (content.message == "Battle Found"){
        phealth = "Health: "+ content.player_health
        pDamage = "Damage: "+ content.player_damage
        bhealth = "Health: "+ content.bot_health
        bDamage = "Damage: "+ content.bot_damage
        document.getElementById('UserName').textContent = content.player_name;
        document.getElementById('Player_Image_ID').src = content.player_image;
        document.getElementById('player_hp_info').textContent = phealth;
        document.getElementById('player_dmg_info').textContent = pDamage;

        document.getElementById('BotName').textContent = content.bot_name;
        document.getElementById('Bot_Image_ID').src = content.bot_image;        
        document.getElementById('bot_hp_info').textContent = bhealth;
        document.getElementById('bot_dmg_info').textContent = bDamage;

        document.getElementById("attack_button").style.display = "block";
        document.getElementById("defense_button").style.display = "block";
        document.getElementById('Result').textContent = content.message;
    }
    setTimeout(function() {
        document.getElementById('Result').textContent = "";
    }, 2000);
}
async function updatebattle(){
    const response = await fetch("/update_single_battle",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-Content-Type-Options': 'nosniff'
        },
    });
    const content = await response.json();
    if (content.mess == "Battle"){
        phealth = "Health: "+ content.player_health
        bhealth = "Health: "+ content.bot_health
        document.getElementById('player_hp_info').textContent = phealth;
        document.getElementById('bot_hp_info').textContent = bhealth;
    }else if (content.mess == "You Lose, Bot Win"){
        phealth = "Health: "+ content.player_health
        bhealth = "Health: "+ content.bot_health
        document.getElementById('player_hp_info').textContent = phealth;
        document.getElementById('bot_hp_info').textContent = bhealth;
        document.getElementById('Result').textContent = content.mess;
        document.getElementById("attack_button").style.display = "none";
        document.getElementById("defense_button").style.display = "none";
        setTimeout(function() {
            document.getElementById('Result').textContent = "";
            document.getElementById('UserName').textContent = "";
            document.getElementById('Player_Image_ID').src = "";
            document.getElementById('player_hp_info').textContent = "";
            document.getElementById('player_dmg_info').textContent = "";
            
            document.getElementById('BotName').textContent = "";
            document.getElementById('Bot_Image_ID').src = "";        
            document.getElementById('bot_hp_info').textContent = "";
            document.getElementById('bot_dmg_info').textContent = "";
        }, 2000);
    }else if (content.mess =="You Win"){
        phealth = "Health: "+ content.player_health
        bhealth = "Health: "+ content.bot_health
        document.getElementById('player_hp_info').textContent = phealth;
        document.getElementById('bot_hp_info').textContent = bhealth;
        document.getElementById('Result').textContent = content.mess;
        document.getElementById("attack_button").style.display = "none";
        document.getElementById("defense_button").style.display = "none";
        setTimeout(function(){
            document.getElementById('Result').textContent = "";
            document.getElementById('UserName').textContent = "";
            document.getElementById('Player_Image_ID').src = "";
            document.getElementById('player_hp_info').textContent = "";
            document.getElementById('player_dmg_info').textContent = "";
            
            document.getElementById('BotName').textContent = "";
            document.getElementById('Bot_Image_ID').src = "";        
            document.getElementById('bot_hp_info').textContent = "";
            document.getElementById('bot_dmg_info').textContent = "";
        }, 2000);
    }
}

async function generate_battle(){
    const response = await fetch("/gen_battle",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-Content-Type-Options': 'nosniff'
        },
    });
    const content = await response.json();
    if (content.message == "Ongoing Battle"){
        document.getElementById('Result').textContent = content.message;
        setTimeout(function() {
            document.getElementById('Result').textContent = "";
        }, 3500);
    }else{
        phealth = "Health: "+ content.player_health
        pDamage = "Damage: "+ content.player_damage
        bhealth = "Health: "+ content.bot_health
        bDamage = "Damage: "+ content.bot_damage
        document.getElementById('UserName').textContent = content.player_name;
        document.getElementById('Player_Image_ID').src = content.player_image;
        document.getElementById('player_hp_info').textContent = phealth;
        document.getElementById('player_dmg_info').textContent = pDamage;

        document.getElementById('BotName').textContent = content.bot_name;
        document.getElementById('Bot_Image_ID').src = content.bot_image;        
        document.getElementById('bot_hp_info').textContent = bhealth;
        document.getElementById('bot_dmg_info').textContent = bDamage;

        document.getElementById("attack_button").style.display = "block";
        document.getElementById("defense_button").style.display = "block";
        document.getElementById('Result').textContent = content.message;
        setTimeout(function() {
            document.getElementById('Result').textContent = "";
        }, 3000);
    }
}
function home(){
    window.location.replace("/home");
}

async function attack(){
    const input = document.getElementById('attack_button').value
    const response = await fetch("/single_battle_gameplay",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-Content-Type-Options': 'nosniff'
        },
        body: JSON.stringify({
            "input":input,
          })
    });
    const content = await response.json();
    document.getElementById('Result').textContent = content.message;
    updatebattle();
}
async function defend(){
    const input = document.getElementById('defense_button').value
    const response = await fetch("/single_battle_gameplay",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-Content-Type-Options': 'nosniff'
        },
        body: JSON.stringify({
            "input":input,
          })
    });
    const content = await response.json();
    document.getElementById('Result').textContent = content.message;
    updatebattle();
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