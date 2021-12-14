class Game {
  constructor(count) {
    this.stoneCrush = new Howl({
      src: ["audio/stone-crush.mp3"],
      volume: 0.5,
    });
    this.laserAudio = new Howl({
      src: ["audio/laser.mp3"],
      volume: 0.5,
    });
    this.players = [];
    this.bullets = [];
    this.stones = [];
    this.fuel = [];
    this.ammo = [];
    this.audioPool = [];
    this.particles = {};
    this.client;
    this.galaxy = {
      friction: 0.8,
      gravity: 0.7,
      density: 50,
      speed: 0.8,
      width: canvas.width,
      height: canvas.height,
    };
    this.gameStarted = false;
    this.gameOver = false;
    this.muted = false;
    this.playerCount = count;

    window.addEventListener("shoot", (e) => {
        this.bullets.push(new Bullet(e.detail, this.galaxy));
        if (!this.muted) this.laserAudio.play();
    });
  }
  initialize() {
    for (let i = 0; i < this.playerCount; i++) {
      this.players.push(new Spaceship(i,this.galaxy));
    }

    for (
      let i = 0;
      i < Math.floor(this.galaxy.width / this.galaxy.density);
      i++
    ) {
      this.stones.push(
        new Stone(randomBetweenNumbers(40, 100), 0.8, this.galaxy)
      );
    }

    for (let i = 0; i < 3; i++) {
      this.fuel.push(new Fuel(20, 30, 0.8, this.galaxy));
    }

    for (let i = 0; i < 1; i++) {
      this.ammo.push(new Ammo(20, 20, 0.8, this.galaxy));
    }
  }
  draw() {
    ctx.fillStyle = "#23211D";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const stone of this.stones) {
      stone.update();
      stone.draw();
      for (const player of this.players) {
        if (checkCollision(stone, player)) {
          if (player.hitStone(stone)) {
            player.explode();
            setTimeout(() => (this.gameOver = true), 1000);
          }
        }
      }
    }

    for (const f of this.fuel) {
      f.update();
      f.draw();
      for (const player of this.players) {
        if (checkCollision(f, player)) {
          player.addFuel(f.amount);
          f.consumed();
        }
      }
    }

    for (const a of this.ammo) {
      a.update();
      a.draw();
      for (const player of this.players) {
        if (checkCollision(a, player)) {
          player.addAmmo(a.amount);
          a.consumed();
        }
      }
    }

    for (const bullet of this.bullets) {
      bullet.update();
      let index;
      for (const stone of this.stones) {
        if (checkCollision(stone, bullet)) {
          index = this.bullets.indexOf(bullet);
          let broke = stone.takeHit(bullet.damage);
          this.bullets.splice(index, 1);
          if (broke && !this.muted) this.stoneCrush.play();
        }
      }
    }

    for (const particle in this.particles) {
        this.particles[particle].update();
    }

    for (const player of this.players) {
      player.update();
    }

    this.galaxy.speed += 0.001;
  }
}
