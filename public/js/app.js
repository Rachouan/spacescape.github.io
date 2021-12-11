const UISTATE = {
  START: "start",
  TUTORIAL: "tutorial",
  HIGHSCORE: "highscore",
  PLAYING: "playing",
};

firebase.initializeApp({
  apiKey: "AIzaSyBGmgYSxACyUG04eFt0HJoFlTAYkepfqOY",
  authDomain: "space-escape-79727.firebaseapp.com",
  projectId: "space-escape-79727",
  storageBucket: "space-escape-79727.appspot.com",
  messagingSenderId: "1096248907906",
  appId: "1:1096248907906:web:f3b006a61e5af11f50fc9b",
});

const db = firebase.firestore();

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 800;
const intro = document.querySelector("#intro");
const gameCardEl = document.querySelector("#gamecard");
const gameoverEl = document.querySelector("#gameoverel");
const tutorial = document.querySelector("#tutorial");
const startBtn = intro.querySelector("#startGame");
const multiplayerBtn = intro.querySelector("#multiPlayer");
const restartBtn = intro.querySelector("#restartGame");
const highscoreform = document.querySelector("#highscoreForm");
const highscoreBtn = document.querySelector("#highscoreBtn");
const instructionsBtn = document.querySelector("#instructions");
const backToGame = document.querySelector("#backToGame");
const mute = document.querySelector("#mute");

const bgAudio = new Howl({
  src: ["audio/bg-audio.mp3"],
  autoplay: true,
  loop: true,
  volume: 0.5,
});

const stoneCrush = new Howl({
  src: ["audio/stone-crush.mp3"],
  volume: 0.5,
});

const laserAudio = new Howl({
  src: ["audio/laser.mp3"],
  volume: 0.5,
});

const arrowKeys = {
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  space: 93,
  upl: 87,
  downl: 83,
  leftl: 65,
  rightl: 68,
  spacel: 91,
};
const wasdKeys = {
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  space: 93,
  upl: 87,
  downl: 83,
  leftl: 65,
  rightl: 68,
  spacel: 91,
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
var audioPool = [];
var particles = {};
var client;
var galaxysettings = {
  friction: 0.8,
  gravity: 0.7,
  density: 50,
  speed: 0.8,
  width: canvas.width,
  height: canvas.height,
};
var gameStarted = false;
var gameOver = false;
var muted = false;
var player, ui;
var uiState = UISTATE.START;
var playerCount = 1; 

var highscore = new HightScore("#highscore");
highscore.getHighscores();

function drawGame() {
  ctx.fillStyle = "#23211D";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const stone of stones) {
    stone.update();
    stone.draw();
    for (const player of players) {
      if (checkCollision(stone, player)) {
        if (player.hitStone(stone)) {
          gameOver = true;
        }
      }
    }
  }

  for (const f of fuel) {
    f.update();
    f.draw();
    for (const player of players) {
      if (checkCollision(f, player)) {
        player.addFuel(f.amount);
        f.consumed();
      }
    }
  }

  for (const a of ammo) {
    a.update();
    a.draw();
    for (const player of players) {
      if (checkCollision(a, player)) {
        player.addAmmo(a.amount);
        a.consumed();
      }
    }
  }

  for (const bullet of bullets) {
    bullet.update();
    let index;
    for (const stone of stones) {
      if (checkCollision(stone, bullet)) {
        index = bullets.indexOf(bullet);
        let broke = stone.takeHit(bullet.damage);
        bullets.splice(index, 1);
        if (broke && !muted) stoneCrush.play();
      }
    }
  }

  for (const particle in particles) {
    particles[particle].update();
  }

  for (const player of players) {
    player.update();
  }

  ui.update(players[0].score, players[0].ammo, players[0].fuel, players[0].shield);
  this.galaxysettings.speed += 0.001;

  //collisions = players.concat(stones,bullets);

  if (!gameOver) {
    requestAnimationFrame(drawGame);
  } else {
    cancelAnimationFrame(drawGame);
    gameIsOver();
  }
}

function gameIsOver() {
  uiState = UISTATE.GAMEOVER;
  setUIState();
  gameoverEl.querySelector("#totalscore").innerHTML = `${Math.floor(
    player.score
  )}m`;
}

function startGame(cnt) {
  playerCount = cnt;
  uiState = UISTATE.PLAYING;
  gameOver = false;
  galaxysettings.speed = 0.8;

  ui = new UI();
  ui.toggleUI();

  stones = [];
  fuel = [];
  bullets = [];
  ammo = [];
  particles = {};
  players = [];

  for(let i=0; i<playerCount; i++) {
    players.push(new Spaceship(i));
  }

  for (let i = 0; i < Math.floor(galaxysettings.width / galaxysettings.density); i++) {
    stones.push(new Stone(randomBetweenNumbers(40, 100), 0.8, galaxysettings));
  }

  for (let i = 0; i < 3; i++) {
    fuel.push(new Fuel(20, 30, 0.8, galaxysettings));
  }

  for (let i = 0; i < 1; i++) {
    ammo.push(new Ammo(20, 20, 0.8, galaxysettings));
  }
  setUIState();
  requestAnimationFrame(drawGame);
}

window.onload = () => {
  setUIState();
  bgAudio.play();

  restartBtn.addEventListener("click", ()=>{ startGame(playerCount)});

  startBtn.addEventListener("click", ()=>{ startGame(1)});

  multiplayerBtn.addEventListener("click",()=>{ startGame(2)});

  window.addEventListener("keydown", (e) => {
    keysDown[e.keyCode] = true;
  });

  window.addEventListener("keyup", (e) => {
    keysDown[e.keyCode] = false;
  });

  window.addEventListener("shoot", (e) => {
    bullets.push(new Bullet(e.detail, galaxysettings));
    if (!muted) laserAudio.play();
  });

  mute.addEventListener("click", (e) => {
    muted = !muted;
    mute.innerHTML = muted ? "Play" : "Mute";
    if (muted) bgAudio.pause();
    else bgAudio.play();
  });

  backToGame.addEventListener("click", (e) => {
    uiState = UISTATE.START;
    setUIState()
  });

  instructionsBtn.addEventListener("click", (e) => {
    uiState = UISTATE.TUTORIAL;
    setUIState()
  });

  highscoreBtn.addEventListener("click", (e) => {
    highscore.showHighscore(true);
  });

  highscoreform.addEventListener("submit", (e) => {
    e.preventDefault();
    var data = new FormData(highscoreform);
    var scoreData = {};
    for (const [name, value] of data) {
      scoreData[name] = value;
    }
    if (scoreData["gamertag"].length) {
      highscore.addHighscore(scoreData["gamertag"], Math.floor(player.score));
      highscoreform.classList.toggle("d-none", true);
      uiState = UISTATE.HIGHSCORE;
    } else {
      alert("Please enter a gamertag");
    }
  });
};

function setUIState() {

  switch (uiState) {
    case UISTATE.TUTORIAL:
      intro.classList.remove("d-none");
      gameCardEl.classList.add("d-none");
      highscoreform.classList.add("d-none");
      highscore.showHighscore(false);
      tutorial.classList.remove("d-none");
      break;

    case UISTATE.START:
      intro.classList.remove("d-none");
      gameCardEl.classList.remove("d-none");
      highscoreform.classList.add("d-none");
      highscore.showHighscore(false);
      tutorial.classList.add("d-none");
      break;

    case UISTATE.HIGHSCORE:
      gameCardEl.classList.add("d-none");
      highscoreform.classList.add("d-none");
      highscore.showHighscore(true);
      tutorial.classList.add("d-none");
      break;

    case UISTATE.GAMEOVER:
      intro.classList.remove("d-none");
      gameCardEl.classList.add("d-none");
      gameoverEl.classList.remove("d-none");
      tutorial.classList.add("d-none");
      highscore.showHighscore(false);
      highscoreform.classList.toggle("d-none", false);
      break;

    default:
      intro.classList.add("d-none");
      gameoverEl.classList.add("d-none");
      gameCardEl.classList.add("d-none");
      highscore.showHighscore(false);
      tutorial.classList.add("d-none");
      break;
  }
  
}
