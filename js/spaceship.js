const maxPower = 0.3;
const maxReverse = 0.3;
const powerFactor = 0.009;
const reverseFactor = 0.009;
const drag = 0.95;
const angularDrag = 0.95;
const turnSpeed = 0.005;

class Spaceship {
  constructor(player,galaxy) {
    this.player = player;
    this.galaxy = galaxy;
    this.width = 40;
    this.height = 40;
    this.img = new Image();
    this.img.src = `images/player${player+1}.png`;
    this.x = Math.floor(this.galaxy.width * Math.random());
    this.y = this.galaxy.height - 100;
    this.vx = 0;
    this.vy = 0;
    this.power = 0;
    this.reverse = 0;
    this.angle = 0;
    this.angularVelocity = 0;
    this.fuel = 100;
    this.ammo = 100;
    this.shield = 100;
    this.exploded = false;
    this.isThrottling = false;
    this.isReversing = false;
  }
  getAmmoPercentage() { return this.ammo / 100;}
  getFuelPercentage() { return this.fuel / 100;}
  getShieldPercentage() { return this.shield / 100;}
  hitStone(stone){

    this.shield -= 1;

    let angleRadians = Math.atan2(this.y - stone.y, this.x - stone.x);
    let radius = stone.width/2 + this.width/2;
    this.x = stone.x+radius*Math.cos(angleRadians);
    this.y = stone.y+radius*Math.sin(angleRadians);

    return this.shield <= 0 || this.fuel <= 0;
  }
  explode(){
    if(!this.exploded){
      new Explosion(this.x, this.y, 200, '#ffffff');
      this.power = 0;
      this.exploded = true;
      this.vx = 0;
      this.vy = 0;
    }
    
  }
  addFuel(amount){
    this.fuel += amount;
    this.fuel = this.fuel >= 100 ? 100 : this.fuel;
  }
  addAmmo(amount){
    this.ammo += amount;
    this.ammo = this.ammo >= 100 ? 100 : this.ammo;
  }
  update() {
    let changed;

    const canTurn = this.power > 0.0025 || this.reverse;

    const pressingUp = keyActive(`${this.player == 0 ? 'up':'upl'}`);
    const pressingDown = keyActive(`${this.player == 0 ? 'down':'downl'}`);

    if (this.isThrottling !== pressingUp || this.isReversing !== pressingDown) {
      changed = true;
      this.isThrottling = pressingUp;
      this.isReversing = pressingDown;
    }

    const turnLeft = canTurn && keyActive(`${this.player == 0 ? 'left':'leftl'}`);
    const turnRight = canTurn && keyActive(`${this.player == 0 ? 'right':'rightl'}`);
    const shoot = keyActive(`${this.player == 0 ? 'space':'spacel'}`);
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

        if(this.ammo > 0) window.dispatchEvent(shootEvent);
        keysDown[`${this.player == 0 ? '93':'91'}`] = false;
        this.ammo = this.ammo > 0 ? this.ammo - 10 : 0;
    }

    if (this.x > this.galaxy.width) {
      this.x -= this.galaxy.width;
      changed = true;
    } else if (this.x < 0) {
      this.x += this.galaxy.width;
      changed = true;
    }

    if (this.y > this.galaxy.height - this.height/3) {
      this.y = this.galaxy.height - this.height/3;
    } else if (this.y < this.height/2) {
      this.y = this.height/2;
    }

    if(this.isThrottling || this.isReversing) this.fuel = this.fuel > 0 ? this.fuel - 0.1 : 0;

    if(this.fuel <= 0){this.power = 0; this.reverse = 0; this.angularVelocity = 0;}

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

    this.vx += Math.sin(this.angle) * (this.power - this.reverse);
    this.vy += Math.cos(this.angle) * (this.power - this.reverse);

    this.x += this.vx;
    this.y -= this.vy;
    this.vx *= drag;
    this.vy *= drag;
    this.angle += this.angularVelocity;
    this.angularVelocity *= angularDrag;
    if(this.power > 0 && this.fuel > 0 && !this.exploded) new Particle(this.x,this.y,this.angle,Math.random()*this.power*20,this.power*50,'#fb6339',Math.random()*1000);
    
    if(this.shield > 0){
      this.draw();
      this.drawUI();
    }
  }
  drawUI(){
    //Ammo
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x - 15 , this.y - 35 , 4, 0, degreesToRadians(this.getAmmoPercentage()*360));
    ctx.stroke();

    ctx.strokeStyle = '#fd6337';
    ctx.beginPath();
    ctx.arc(this.x , this.y - 35 , 4, 0, degreesToRadians(this.getFuelPercentage()*360));
    ctx.stroke();

    ctx.strokeStyle = '#32c1ff';
    ctx.beginPath();
    ctx.arc(this.x + 15 , this.y - 35 , 4, 0, degreesToRadians(this.getShieldPercentage()*360));
    ctx.stroke();
    ctx.restore();
    
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
    ctx.restore();
  }
}
