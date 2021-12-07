class Stone extends Obstacle {
    constructor(size,speed,galaxy){
        super(size,size,speed,"stone",galaxy)
        this.img = new Image(this.width, this.width);
        this.img.src = `images/stones/stone-${randomBetweenNumbers(1,4)}.png`;
        this.durability = 10;
    }
    takeHit(damage){
        this.durability -= damage;
        this.width -= damage;
        this.height -= damage;
        if(this.durability < 0){
            this.setPosition();
            this.durability = 10;
            return true;
        }
        return false;
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