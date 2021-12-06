class Fuel extends Obstacle {
    constructor(w,h,speed,galaxy){
        super(w,h,speed,"stone",galaxy)
        this.img = new Image(this.width, this.width);
        this.img.src = `images/fuel.png`;
        this.amount = 100;
    }
    consumed(){
        this.setRandomPosition();
    }
    draw(){
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = '#ff0000';
        ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }
}