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

const players = [];
const bullets = [];
const enemies = [];
let collisions = [];

var client;
var galaxysettings = {
  friction: 0.8,
  gravity: 0.7,
  density: 50,
  width: 1200,
  height: 900,
};

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = galaxysettings.width;
canvas.height = galaxysettings.height;

var gameStarted = false;
var fps, fpsInterval, startTime, now, then, elapsed;


const collision = new Collision();



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
const newPlayer = new Spaceship(client);
players.push(newPlayer);


for(let i = 0; i < galaxysettings.density; i++){
  enemies.push(new Enemy(galaxysettings,enemies));
}

window.addEventListener("keydown", (e) => {
  keysDown[e.keyCode] = true;
});

window.addEventListener("keyup", (e) => {
  keysDown[e.keyCode] = false;
});

window.addEventListener("shoot", (e) => {
  bullets.push(new Bullet(e.detail,galaxysettings));
});

/*window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);

//KEYHANDLERS

function keyDownHandler(e) {
  e.preventDefault();

  switch (e.keyCode) {
    case 37:
      controller.left = true;
      controller.speed = -8;
      break;

    case 39:
      controller.right = true;
      controller.speed = 8;
      break;

    case 32:
      controller.jump = true;
      controller.jumpForce = -15;
      break;
  }
  updateController();
}

function keyUpHandler(e) {
  e.preventDefault();

  switch (e.keyCode) {
    case 37:
      controller.left = false;
      controller.speed = 0;
      break;

    case 39:
      controller.right = false;
      controller.speed = 0;
      break;

    case 32:
      controller.jump = false;
      controller.jumpForce = 0;
      break;
  }
  //updateController();
}*/

function updateController() {
  // request another frame
  players.map((player) => {
    console.log(
      `Player id = ${player.client.id} === ${client.id} = ${
        player.client.id === client.id
      }`
    );
    player.client.controller =
      player.client.id === client.id
        ? client.controller
        : player.client.controller;
  });

  //socket.emit('updatePosition', {id: client.id, controller: controller});
}


function drawGame() {
  // calc elapsed time since last loop

  ctx.fillStyle = "#110c29";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const enemy of enemies) {
    enemy.update();
  }
  for (const bullet of bullets) {
    bullet.update();
  }
  for (const player of players) {
    player.update();
    collision.checkCollision(player,enemies);
  }
  
  //collisions = players.concat(enemies,bullets);
  

  requestAnimationFrame(drawGame);
}

drawGame();
