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
var ammo = [];

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const intro = document.querySelector('#intro');
const gameCardEl = document.querySelector('#gamecard');
const gameoverEl = document.querySelector('#gameoverel');
const tutorial = document.querySelector('#tutorial');
const startBtn = intro.querySelector("#startGame");
const restartBtn = intro.querySelector("#restartGame");

var client;
var galaxysettings = {
  friction: 0.8,
  gravity: 0.7,
  density: 20,
  speed: 0.8,
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


/*function updateController() {
  // request another frame
  players.map((player) => {
    player.client.controller =
      player.client.id === client.id
        ? client.controller
        : player.client.controller;
  });
}*/


function drawGame() {

  ctx.fillStyle = "#23211D";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const stone of stones) {
    stone.update();
    stone.draw();
    if(checkCollision(stone,player)) {
      if(player.hitStone()){
        gameOver = true;
      }
    }
    
  }
  for (const f of fuel) {
    f.update();
    f.draw();
    if(checkCollision(f,player)) { 
      player.addFuel(f.amount)
      f.consumed();
    }
  }

  for (const a of ammo) {
    a.update();
    a.draw();
    if(checkCollision(a,player)) { 
      player.addAmmo(a.amount)
      a.consumed();
    }
  }

  for (const bullet of bullets) {
    bullet.update();
    let index;
    for (const stone of stones) {
      if(checkCollision(stone,bullet)) {
        index = bullets.indexOf(bullet);
        stone.takeHit(bullet.damage);
        bullets.splice(index, 1);
      }
    }
  }

  player.update();
  ui.update(player.score,player.ammo,player.fuel,player.shield);
  this.galaxysettings.speed += 0.00001;
  
  //collisions = players.concat(stones,bullets);
  
  if(!gameOver){
    requestAnimationFrame(drawGame);
  }else{
    cancelAnimationFrame(drawGame);
    gameIsOver();
  }

}

function gameIsOver(){
  intro.classList.remove('d-none');
  gameCardEl.classList.add('d-none');
  gameoverEl.classList.remove('d-none');
  gameoverEl.querySelector('#totalscore').innerHTML=`${Math.floor(player.score)}m`;
}

function startGame(){
  gameOver = false;
  intro.classList.add('d-none');
  gameoverEl.classList.add('d-none');
  gameCardEl.classList.add('d-none');
  tutorial.classList.add('d-none');

  player = new Spaceship(client);
  ui = new UI();

  ui.toggleUI();

  stones = [];
  fuel = [];
  bullets = [];
  ammo = [];

  for(let i = 0; i < galaxysettings.density; i++){
    stones.push(new Stone(randomBetweenNumbers(40,100),0.8, galaxysettings));
  }

  for(let i = 0; i < 3; i++){
    fuel.push(new Fuel(20,30,0.8, galaxysettings));
  }

  for(let i = 0; i < 1; i++){
    ammo.push(new Ammo(20,20,0.8, galaxysettings));
  }
  requestAnimationFrame(drawGame);
}

restartBtn.addEventListener('click',startGame)

startBtn.addEventListener('click',startGame)

window.addEventListener("keydown", (e) => {
  keysDown[e.keyCode] = true;
});

window.addEventListener("keyup", (e) => {
  keysDown[e.keyCode] = false;
});

window.addEventListener("shoot", (e) => {
  bullets.push(new Bullet(e.detail,galaxysettings));
});


