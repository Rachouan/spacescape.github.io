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
canvas.width = 1100;
canvas.height = 700;
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
const highscore = new HightScore("#highscore");
highscore.getHighscores();
var game;
var uiState = UISTATE.START;
var fps, fpsInterval, startTime, now, then, elapsed;

const bgAudio = new Howl({
  src: ["audio/bg-audio.mp3"],
  autoplay: true,
  loop: true,
  volume: 0.5,
});

const arrowKeys = {
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  space: 32,
  upl: 87,
  downl: 83,
  leftl: 65,
  rightl: 68,
  spacel: 70,
};
const wasdKeys = {
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  space: 32,
  upl: 87,
  downl: 83,
  leftl: 65,
  rightl: 68,
  spacel: 70,
};

const keyActive = (key) => {
  return keysDown[arrowKeys[key]] || keysDown[wasdKeys[key]] || false;
};


const keysDown = {};

window.addEventListener("keydown", (e) => {
  keysDown[e.keyCode] = true;
  console.log(e.keyCode);
});

window.addEventListener("keyup", (e) => {
  keysDown[e.keyCode] = false;
});

function drawGame() {
  

  requestAnimationFrame(drawGame);

  ui.update(game.getScore(), game.players[0].ammo, game.players[0].fuel, game.players[0].shield);

  now = Date.now();
  elapsed = now - then;

  if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval);
      console.log('Drawing:',then);
      if (!game.gameOver) {
        game.update();
      } else {
        cancelAnimationFrame(drawGame);
        gameIsOver();
      }
      
  }
  
}

function gameIsOver() {
  uiState = UISTATE.GAMEOVER;
  setUIState();
  gameoverEl.querySelector("#totalscore").innerHTML = `${game.getScore()}m`;
}

function startGame(cnt) {
  uiState = UISTATE.PLAYING;
  game = new Game(cnt)
  game.initialize();
  ui = new UI();
  ui.toggleUI();

  setUIState();
  fps = 60;
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  requestAnimationFrame(drawGame);
}

window.onload = () => {
  setUIState();
  bgAudio.play();

  restartBtn.addEventListener("click", ()=>{ startGame(game.playerCount)});

  startBtn.addEventListener("click", ()=>{ startGame(1)});

  multiplayerBtn.addEventListener("click",()=>{ startGame(2)});


  mute.addEventListener("click", (e) => {
    game.muted = !game.muted;
    mute.innerHTML = game.muted ? "Play" : "Mute";
    if (game.muted) bgAudio.pause();
    else bgAudio.play();
  });

  backToGame.addEventListener("click", (e) => {
    uiState = UISTATE.START;
    setUIState();
  });

  instructionsBtn.addEventListener("click", (e) => {
    uiState = UISTATE.TUTORIAL;
    setUIState();
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
      highscore.addHighscore(scoreData["gamertag"], game.getScore());
      //highscoreform.classList.toggle("d-none", true);
      uiState = UISTATE.HIGHSCORE;
      setUIState();
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
