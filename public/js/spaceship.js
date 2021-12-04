const maxPower = 0.3;
const maxReverse = 0.3;
const powerFactor = 0.009;
const reverseFactor = 0.009;

const drag = 0.95;
const angularDrag = 0.95;
const turnSpeed = 0.005;

class Spaceship {
  constructor(client) {
    this.type = "player";
    this.client = client;
    this.width = 25;
    this.height = 50;
    this.img = new Image(60, 45);
    this.img.src = 'images/ship.svg';
    this.x = Math.floor(galaxysettings.width * Math.random());
    this.y = galaxysettings.height - 100;
    this.vy = 0;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.power = 0;
    this.reverse = 0;
    this.angle = 0;
    this.angularVelocity = 0;
    this.isThrottling = false;
    this.isReversing = false;
  }
  update() {
    let changed;

    const canTurn = this.power > 0.0025 || this.reverse;

    const pressingUp = keyActive("up");
    const pressingDown = keyActive("down");

    if (this.isThrottling !== pressingUp || this.isReversing !== pressingDown) {
      changed = true;
      this.isThrottling = pressingUp;
      this.isReversing = pressingDown;
    }

    const turnLeft = canTurn && keyActive("left");
    const turnRight = canTurn && keyActive("right");
    const shoot = keyActive("space");
    const shootEvent = new CustomEvent('shoot', { detail: this } );

    if (this.isTurningLeft !== turnLeft) {
      changed = true;
      this.isTurningLeft = turnLeft;
    }
    if (this.isTurningRight !== turnRight) {
      changed = true;
      this.isTurningRight = turnRight;
    }
    if (shoot) {
        window.dispatchEvent(shootEvent);
        keysDown[32] = false;
    }

    if (this.x > galaxysettings.width) {
      this.x -= galaxysettings.width;
      changed = true;
    } else if (this.x < 0) {
      this.x += galaxysettings.width;
      changed = true;
    }

    if (this.y > galaxysettings.height - this.height/3) {
      this.y = galaxysettings.height - this.height/3;
      //changed = true;
    } else if (this.y < this.height/2) {
      this.y = this.height/2;
      //changed = true;
    }

    if (this.isThrottling) {
      this.power += powerFactor * this.isThrottling;
    } else {
      this.power -= powerFactor;
    }
    if (this.isReversing) {
      this.reverse += reverseFactor;
    } else {
      this.reverse -= reverseFactor;
    }

    this.power = Math.max(0, Math.min(maxPower, this.power));
    this.reverse = Math.max(0, Math.min(maxReverse, this.reverse));

    const direction = this.power > this.reverse ? 1 : -1;

    if (this.isTurningLeft) {
      this.angularVelocity -= direction * turnSpeed * this.isTurningLeft;
    }
    if (this.isTurningRight) {
      this.angularVelocity += direction * turnSpeed * this.isTurningRight;
    }

    this.xVelocity += Math.sin(this.angle) * (this.power - this.reverse);
    this.yVelocity += Math.cos(this.angle) * (this.power - this.reverse);

    this.x += this.xVelocity;
    this.y -= this.yVelocity;
    this.xVelocity *= drag;
    this.yVelocity *= drag;
    this.angle += this.angularVelocity;
    this.angularVelocity *= angularDrag;

    this.draw();
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = "#ffffff";
    ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
    ctx.restore();
  }
}
