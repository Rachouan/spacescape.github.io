class Bullet{
    constructor(spaceship,galaxy){
        this.type = "bullet";
        this.power = 4;
        this.width = 4;
        this.height = 20;
        this.galaxy = galaxy;
        this.damage = 10 * Math.random();
        this.vx = spaceship.vx;
        this.vy = spaceship.vy;
        this.x = spaceship.x;
        this.y = spaceship.y;
        this.angle = spaceship.angle;
    }
    update(){
        this.vx += Math.sin(this.angle) * this.power;
        this.vy += Math.cos(this.angle) * this.power;
        this.x += this.vx;
        this.y -= this.vy;
        this.draw();
    }
    draw(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle="#fb6339";
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }
}