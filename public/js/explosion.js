class Explosion{
    constructor(x,y,size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.explode();
    }
    explode(){
        for(var i=0;i<this.size; i++){
            new Particle(this.x,this.y,0,0,Math.random()*360,Math.random()*5,Math.random()*10,'#fb6339',Math.random()*1000);
        }
    }
}