class Particle{
    constructor(x,y,angle,speed,size,color,id){
        this.id = id;
        this.x = x;
        this.y = y;
        this.angle = angle
        this.size = size;
        this.color = color;
        this.speed = speed;
        this.vx = Math.sin(this.angle) * this.speed;
        this.vy = Math.cos(this.angle) * this.speed;
        this.life = 0;
        this.maxLife = 100;
        this.opacity = 100;
        game.particles[this.id] = this;
    }
    update(){

        this.x -= this.vx;
        this.y += this.vy;

        this.life++;
        this.opacity-= 1;
        this.size -=0.5;
        
        // If Particle is old, it goes in the chamber for renewal
        if (this.life >= this.maxLife || this.size <= 0) {
        delete game.particles[this.id];
        }else{
          this.draw();
        }

        // Create the shapes
        
    }
    draw(){

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity/100;
      ctx.fillStyle=this.color;
      ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
      ctx.restore();
      
    }
}
