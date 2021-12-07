class Obstacle{
    constructor(width,height,speed,type,galaxy){
        this.type = type;
        this.galaxy = galaxy;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.angle = 360 * Math.random();
        this.x = 0;
        this.y = 0;
        this.setPosition();
    }
    setRandomPosition(){
        this.x = Math.abs(this.galaxy.width * Math.random())
        this.y = -Math.abs(this.galaxy.height * Math.random() + this.height);
    }
    setPosition(){
        this.setRandomPosition();
    }
    update(){
        this.y += this.galaxy.speed;
        this.angle += 1/this.width;
        if(this.y >= this.galaxy.height + this.height){
            this.setPosition();
        }
    }
    draw(){
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        //ctx.fillStyle = this.color;
        ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }
}