class Fuel extends Obstacle {
    constructor(w,h,speed,galaxy){
        super(w,h,speed,"fuel",galaxy)
        this.img = new Image(this.width, this.width);
        this.img.src = `images/fuel.png`;
        this.amount = 100;
    }
    consumed(){
        this.setRandomPosition();
    }
    draw(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }
}