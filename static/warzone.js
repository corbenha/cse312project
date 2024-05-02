async function forfeit(){
    try{
        var game_id = document.getElementById('match_id').value
        const response = await fetch("/forfeit",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-Content-Type-Options': 'nosniff'
            },
            body: JSON.stringify({
                "id": game_id
            })
        });
        if(response.ok){
            const content = await response.json();
            document.getElementById("p1_attack_button").style.opacity = "0";
            document.getElementById("p1_defense_button").style.opacity = "0";
            document.getElementById("p1_attack_button").style.cursor = "";
            document.getElementById("p1_defense_button").style.cursor = "";

            document.getElementById("p2_attack_button").style.opacity = "0";
            document.getElementById("p2_defense_button").style.opacity = "0";
            document.getElementById("p2_attack_button").style.cursor = "";
            document.getElementById("p2_defense_button").style.cursor = "";

            document.getElementById('Server_Mess1').textContent = content.servmess
            document.getElementById('Server_Mess2').textContent = 'Redirecting to Battle Page in 5 Seconds'

            var attack1 = document.getElementById('p1_attack_button');
            var defense1 = document.getElementById('p1_defense_button');
            attack1.disabled = true;
            defense1.disabled = true;

            var attack2 = document.getElementById('p2_attack_button');
            var defense2 = document.getElementById('p2_defense_button');
            attack2.disabled = true;
            defense2.disabled = true;
            clearInterval(intervalID);
            setTimeout(function() {
                window.location.replace("/battle");
            }, 5000);
        }
    }catch(error){
        console.error("Error:", error);
    }
}

async function get_battle(){
    try{
        const response = await fetch('/get_battle', {
            method: 'GET',
            headers: {
                'X-Content-Type-Options': 'nosniff'
            }
        });
        if(response.ok){
            const data = await response.json();
            if (data.user == 'player1' && data.p1move == false){
                p1health = "Health: "+ data.player1health;
                p1Damage = "Damage: "+ data.player1char.Damage;
                p2health = "Health: "+ data.player2health;
                p2Damage = "Damage: "+ data.player2char.Damage;
                round_text = "Round "+ data.round.toString()
                document.getElementById('match_id').value = data.game_id;
                document.getElementById('round_num').textContent = round_text

                document.getElementById('player1_name').textContent = data.player1;
                document.getElementById('player1_health').textContent = p1health;
                document.getElementById('player1_Damage').textContent = p1Damage;
                document.getElementById('player1_char_image').src = data.player1char.image;
                document.getElementById('player1_profile').src = data.player1_profile;

                document.getElementById('player2_name').textContent = data.player2;
                document.getElementById('player2_health').textContent = p2health;
                document.getElementById('player2_Damage').textContent = p2Damage;
                document.getElementById('player2_char_image').src = data.player2char.image;
                document.getElementById('player2_profile').src = data.player2_profile;

                document.getElementById("p1_attack_button").style.opacity = "1";
                document.getElementById("p1_defense_button").style.opacity = "1";
                document.getElementById("p1_attack_button").style.cursor = "pointer";
                document.getElementById("p1_defense_button").style.cursor = "pointer";

                var attack = document.getElementById('p1_attack_button');
                var defense = document.getElementById('p1_defense_button');
                attack.disabled = false;
                defense.disabled = false;

            }else if (data.user == 'player1' && data.p1move != false){
                p1health = "Health: "+ data.player1health;
                p1Damage = "Damage: "+ data.player1char.Damage;
                p2health = "Health: "+ data.player2health;
                p2Damage = "Damage: "+ data.player2char.Damage;
                round_text = "Round "+ data.round.toString()
                document.getElementById('match_id').value = data.game_id;
                document.getElementById('round_num').textContent = round_text

                document.getElementById('player1_name').textContent = data.player1;
                document.getElementById('player1_health').textContent = p1health;
                document.getElementById('player1_Damage').textContent = p1Damage;
                document.getElementById('player1_char_image').src = data.player1char.image;
                document.getElementById('player1_profile').src = data.player1_profile;

                document.getElementById('player2_name').textContent = data.player2;
                document.getElementById('player2_health').textContent = p2health;
                document.getElementById('player2_Damage').textContent = p2Damage;
                document.getElementById('player2_char_image').src = data.player2char.image;
                document.getElementById('player2_profile').src = data.player2_profile;

            }else if (data.user == 'player2' && data.p2move == false){
                p1health = "Health: "+ data.player1health;
                p1Damage = "Damage: "+ data.player1char.Damage;
                p2health = "Health: "+ data.player2health;
                p2Damage = "Damage: "+ data.player2char.Damage;
                round_text = "Round "+ data.round.toString()
                document.getElementById('match_id').value = data.game_id;
                document.getElementById('round_num').textContent = round_text

                document.getElementById('player1_name').textContent = data.player1;
                document.getElementById('player1_health').textContent = p1health;
                document.getElementById('player1_Damage').textContent = p1Damage;
                document.getElementById('player1_char_image').src = data.player1char.image;
                document.getElementById('player1_profile').src = data.player1_profile;

                document.getElementById('player2_name').textContent = data.player2;
                document.getElementById('player2_health').textContent = p2health;
                document.getElementById('player2_Damage').textContent = p2Damage;
                document.getElementById('player2_char_image').src = data.player2char.image;
                document.getElementById('player2_profile').src = data.player2_profile;

                document.getElementById("p2_attack_button").style.opacity = "1";
                document.getElementById("p2_defense_button").style.opacity = "1";
                document.getElementById("p2_attack_button").style.cursor = "pointer";
                document.getElementById("p2_defense_button").style.cursor = "pointer";

                var attack = document.getElementById('p2_attack_button');
                var defense = document.getElementById('p2_defense_button');
                attack.disabled = false;
                defense.disabled = false;
            }else{
                p1health = "Health: "+ data.player1health;
                p1Damage = "Damage: "+ data.player1char.Damage;
                p2health = "Health: "+ data.player2health;
                p2Damage = "Damage: "+ data.player2char.Damage;
                round_text = "Round "+ data.round.toString()
                document.getElementById('match_id').value = data.game_id;
                document.getElementById('round_num').textContent = round_text

                document.getElementById('player1_name').textContent = data.player1;
                document.getElementById('player1_health').textContent = p1health;
                document.getElementById('player1_Damage').textContent = p1Damage;
                document.getElementById('player1_char_image').src = data.player1char.image;
                document.getElementById('player1_profile').src = data.player1_profile;

                document.getElementById('player2_name').textContent = data.player2;
                document.getElementById('player2_health').textContent = p2health;
                document.getElementById('player2_Damage').textContent = p2Damage;
                document.getElementById('player2_char_image').src = data.player2char.image;
                document.getElementById('player2_profile').src = data.player2_profile;
            }
        };
    }catch(error){
        console.error("Error:", error);
    };
}

async function attack(player){
    try{
        const id = document.getElementById('match_id').value
        const response = await fetch("/attack",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'X-Content-Type-Options': 'nosniff'
            },
            body: JSON.stringify({
                'match_id': id,
                'player':player,
                'time': Math.floor(Date.now() / 1000)
              })
        });
        if(player =='p1'){
            document.getElementById("p1_attack_button").style.opacity = "0";
            document.getElementById("p1_defense_button").style.opacity = "0";
            document.getElementById("p1_attack_button").style.cursor = "";
            document.getElementById("p1_defense_button").style.cursor = "";
            var attack = document.getElementById('p1_attack_button');
            var defense = document.getElementById('p1_defense_button');
            attack.disabled = true;
            defense.disabled = true;
        }else if (player =='p2'){
            document.getElementById("p2_attack_button").style.opacity = "0";
            document.getElementById("p2_defense_button").style.opacity = "0";
            document.getElementById("p2_attack_button").style.cursor = "";
            document.getElementById("p2_defense_button").style.cursor = "";
            var attack = document.getElementById('p2_attack_button');
            var defense = document.getElementById('p2_defense_button');
            attack.disabled = true;
            defense.disabled = true;
        }
        if(response.ok){
            const data = await response.json();
            if(data.error == true){
                console.log(data)
                document.getElementById('Server_Mess1').textContent = data.servmess;
                document.getElementById('Server_Mess2').textContent = 'Redirecting to Battle Page in 5 Seconds';
                clearInterval(intervalID);
                setTimeout(function() {
                    window.location.replace("/battle");
                }, 5000);
            }
        }
    }catch(error){
        console.error("Error:", error);
    };
}

async function defend(player){
    try{
        const id = document.getElementById('match_id').value
        const response = await fetch("/defend",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'X-Content-Type-Options': 'nosniff'
            },
            body: JSON.stringify({
                'match_id': id,
                'player':player,
                'time': Math.floor(Date.now() / 1000)
              })
        });
        if(player =='p1'){
            document.getElementById("p1_attack_button").style.opacity = "0";
            document.getElementById("p1_defense_button").style.opacity = "0";
            document.getElementById("p1_attack_button").style.cursor = "";
            document.getElementById("p1_defense_button").style.cursor = "";
            var attack = document.getElementById('p1_attack_button');
            var defense = document.getElementById('p1_defense_button');
            attack.disabled = true;
            defense.disabled = true;
        }else if (player =='p2'){
            document.getElementById("p2_attack_button").style.opacity = "0";
            document.getElementById("p2_defense_button").style.opacity = "0";
            document.getElementById("p2_attack_button").style.cursor = "";
            document.getElementById("p2_defense_button").style.cursor = "";
            var attack = document.getElementById('p2_attack_button');
            var defense = document.getElementById('p2_defense_button');
            attack.disabled = true;
            defense.disabled = true;
        }
        if(response.ok){
            const data = await response.json();
            if(data.error == true){
                document.getElementById('Server_Mess1').textContent = data.servmess;
                document.getElementById('Server_Mess2').textContent = 'Redirecting to Battle Page in 5 Seconds';
                clearInterval(intervalID);
                setTimeout(function() {
                    window.location.replace("/battle");
                }, 5000);
            }
        }
    }catch(error){
        console.error("Error:", error);
    };
}

async function update_battle(){
    try{
        var matchId = document.getElementById("match_id").value;
        const response = await fetch("/update_battle",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-Content-Type-Options': 'nosniff'
            },
            body: JSON.stringify({
                "id": matchId,
                'time': Math.floor(Date.now()/1000)
            })
        });
        if(response.ok){
            const content = await response.json();
            if(content.auth == false){
                window.location.replace("/");
            }
            if(content.gover == false){
                p1health = "Health: "+ content.player1health;
                p2health = "Health: "+ content.player2health;
                round_text = "Round "+ content.round.toString()
                document.getElementById('round_num').textContent = round_text

                document.getElementById('player1_health').textContent = p1health;
                document.getElementById('player2_health').textContent = p2health;

                document.getElementById('Server_Mess1').textContent = content.lround
                document.getElementById('Server_Mess2').textContent = content.servmess

                if(content.user == 'player1'){
                    if (content.pmove == false){
                        document.getElementById("p1_attack_button").style.opacity = "1";
                        document.getElementById("p1_defense_button").style.opacity = "1";
                        document.getElementById("p1_attack_button").style.cursor = "pointer";
                        document.getElementById("p1_defense_button").style.cursor = "pointer";

                        var attack = document.getElementById('p1_attack_button');
                        var defense = document.getElementById('p1_defense_button');
                        attack.disabled = false;
                        defense.disabled = false;
                    }else{
                        document.getElementById("p1_attack_button").style.opacity = "0";
                        document.getElementById("p1_defense_button").style.opacity = "0";
                        document.getElementById("p1_attack_button").style.cursor = "";
                        document.getElementById("p1_defense_button").style.cursor = "";

                        var attack = document.getElementById('p1_attack_button');
                        var defense = document.getElementById('p1_defense_button');
                        attack.disabled = true;
                        defense.disabled = true;
                    }
                }else{
                    if (content.pmove == false){
                        document.getElementById("p2_attack_button").style.opacity = "1";
                        document.getElementById("p2_defense_button").style.opacity = "1";
                        document.getElementById("p2_attack_button").style.cursor = "pointer";
                        document.getElementById("p2_defense_button").style.cursor = "pointer";

                        var attack = document.getElementById('p2_attack_button');
                        var defense = document.getElementById('p2_defense_button');
                        attack.disabled = false;
                        defense.disabled = false;
                    }else{
                        document.getElementById("p2_attack_button").style.opacity = "0";
                        document.getElementById("p2_defense_button").style.opacity = "0";
                        document.getElementById("p2_attack_button").style.cursor = "";
                        document.getElementById("p2_defense_button").style.cursor = "";

                        var attack = document.getElementById('p2_attack_button');
                        var defense = document.getElementById('p2_defense_button');
                        attack.disabled = true;
                        defense.disabled = true;
                    }
                }
            }else if (content.gover == true){
                p1health = "Health: "+ content.player1health;
                p2health = "Health: "+ content.player2health;
                round_text = "Round "+ content.round.toString()
                document.getElementById('round_num').textContent = round_text

                document.getElementById('player1_health').textContent = p1health;
                document.getElementById('player2_health').textContent = p2health;

                document.getElementById("p1_attack_button").style.opacity = "0";
                document.getElementById("p1_defense_button").style.opacity = "0";
                document.getElementById("p1_attack_button").style.cursor = "";
                document.getElementById("p1_defense_button").style.cursor = "";

                document.getElementById("p2_attack_button").style.opacity = "0";
                document.getElementById("p2_defense_button").style.opacity = "0";
                document.getElementById("p2_attack_button").style.cursor = "";
                document.getElementById("p2_defense_button").style.cursor = "";

                document.getElementById('Server_Mess1').textContent = content.servmess
                document.getElementById('Server_Mess2').textContent = 'Redirecting to Battle Page in 5 Seconds'

                var attack1 = document.getElementById('p1_attack_button');
                var defense1 = document.getElementById('p1_defense_button');
                attack1.disabled = true;
                defense1.disabled = true;

                var attack2 = document.getElementById('p2_attack_button');
                var defense2 = document.getElementById('p2_defense_button');
                attack2.disabled = true;
                defense2.disabled = true;
                clearInterval(intervalID);
                setTimeout(function() {
                    window.location.replace("/battle");
                }, 5000);
            }
        }
    }catch(error){
        console.error("Error:", error);
    }
}
update_battle();

var intervalID = setInterval(update_battle, 500);

