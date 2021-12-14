class Explosion{
    constructor(x,y,size,color){
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.explode();
    }
    explode(){
        for(var i=0;i<this.size; i++){
            new Particle(this.x,this.y,Math.random()*360,Math.random()*5,Math.random()*10,this.color,Math.random()*1000);
        }
    }
}