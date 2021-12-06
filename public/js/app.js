//var socket = io();

const arrowKeys = {
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  space:32
};
const wasdKeys = {
  up: 87,
  down: 83,
  left: 65,
  right: 68,
  space:32
};

const keyActive = (key) => {
  return keysDown[arrowKeys[key]] || keysDown[wasdKeys[key]] || false;
};

const keysDown = {};

var players = [];
var bullets = [];
var stones = [];
var fuel = [];
var collisions = [];

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const intro = document.querySelector('#intro');
const startBtn = intro.querySelector("#startGame");

var client;
var galaxysettings = {
  friction: 0.8,
  gravity: 0.7,
  density: 20,
  width: canvas.width,
  height: canvas.height,
};



var gameStarted = false;
var gameOver = false;
// Inital starting position

/*socket.on('socketClientID', (clientInfo) => {
    console.log('CLIENT ADDED',clientInfo);
    //players = clientInfo.clients;
    client = {
      id:clientInfo.id,
      controller: new Controller()
    }
    const newPlayer = new Player(client)
    players.push(newPlayer)
    socket.emit('newPlayer', newPlayer);
    console.log(players);
})

socket.on('updatedPosition', (client) => {
  players.map( player =>{ 
    console.log(`Player id = ${player.client.id} === ${client.id} = ${player.client.id === client.id}`);
    player.client.controller = player.client.id === client.id ? client.controller : player.client.controller;
  })
})*/

client = {
  id: "player01",
};

let player,ui;


function updateController() {
  // request another frame
  players.map((player) => {
    player.client.controller =
      player.client.id === client.id
        ? client.controller
        : player.client.controller;
  });

  //socket.emit('updatePosition', {id: client.id, controller: controller});
}


function drawGame() {
  // calc elapsed time since last loop

  ctx.fillStyle = "#23211D";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const stone of stones) {
    stone.update();
    stone.draw();
    if(checkCollision(stone,player)) player.hitStone();
    
  }
  for (const f of fuel) {
    f.update();
    f.draw();
    if(checkCollision(f,player)) { 
      player.addFuel(f.amount)
      f.consumed();
    }
  }
  for (const bullet of bullets) {
    bullet.update();
  }

  player.update();
  ui.update(player.score,player.ammo,player.fuel);
  
  //collisions = players.concat(stones,bullets);
  
  if(!gameOver){
    requestAnimationFrame(drawGame);
  }else{
    cancelAnimationFrame(drawGame);
  }

}

function startGame(){

  player = new Spaceship(client);
  ui = new UI();

  ui.toggleUI();

  stones = [];
  fuel = [];
  bullets = [];

  for(let i = 0; i < galaxysettings.density; i++){
    stones.push(new Stone(randomBetweenNumbers(40,100),0.8, galaxysettings));
  }

  for(let j = 0; j < 3; j++){
    fuel.push(new Fuel(20,30,0.8, galaxysettings));
  }
  cancelAnimationFrame(drawGame);
  requestAnimationFrame(drawGame);
}

startBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  intro.classList.toggle('d-none');
  startGame();
})

window.addEventListener("keydown", (e) => {
  keysDown[e.keyCode] = true;
});

window.addEventListener("keyup", (e) => {
  keysDown[e.keyCode] = false;
});

window.addEventListener("shoot", (e) => {
  bullets.push(new Bullet(e.detail,galaxysettings));
});


