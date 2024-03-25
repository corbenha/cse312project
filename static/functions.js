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

async function register(){
  //getting credentials
  var user = document.getElementById('sign-up-form-email').value
  var password = document.getElementById('sign-up-form-pass').value
  var pass_retype = document.getElementById('sign-up-form-pass-retype').value

  //making request
  const response = await fetch("/register",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-Content-Type-Options': 'nosniff'
    },
    body: JSON.stringify({
      "username":user,
      "password":password,
      "retype": pass_retype
    })
  });

  //display message
  const content = await response.json();
  document.getElementById('Register_Message').textContent = content.message;

  // Reseting Input 
  if (content.message == "Registration successful" ){
    document.getElementById("sign-up-form-email").value = "";
    document.getElementById("sign-up-form-pass").value = "";
    document.getElementById("sign-up-form-pass-retype").value = "";
  };
}

async function Login(){
  //getting credentials
  var user = document.getElementById('login-form-username').value
  var password = document.getElementById('login-form-pass').value

  //making request
  const response = await fetch("/login",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-Content-Type-Options': 'nosniff'
    },
    body: JSON.stringify({
      "username":user,
      "password":password,
    })
  });
  //display message
  const content = await response.json();
  document.getElementById('LoginMessage').textContent = content.message;

  //redirect
  if (content.message == 'Login successful'){
    window.location.replace("/home");
  }
}

async function battle(){
  window.location.replace("/battle")  
}
