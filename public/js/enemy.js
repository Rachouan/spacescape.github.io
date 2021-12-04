class Enemy{
    constructor(galaxy,enemies){
        this.type = "enemy";
        this.speed = 0.8;
        this.minSize = 40;
        this.maxSize = 80;
        this.color= '#ff0000';
        this.width = Math.floor(Math.random() * (this.maxSize - this.minSize + 1) + this.minSize);
        this.angle = 360 * Math.random();
        this.height = this.width;
        this.galaxy = galaxy;
        this.enemies = enemies;
        this.img = new Image(this.width, this.width);
        this.img.src = 'images/rock.png';
        this.durability = 10;
        this.x = 0;
        this.y = 0;
        this.setPosition();
    }
    setRandomPosition(){
        this.x = Math.abs(this.galaxy.width * Math.random())
        this.y = -Math.abs(this.galaxy.height * Math.random());
    }
    setPosition(){
        let i = 0;
        let enemy;
        let goodPos = false;
        let dist;
        this.setRandomPosition();
        if(this.enemies.length){
            do {
                enemy = this.enemies[i];
                dist = Math.sqrt( Math.pow((this.x + this.height/2 - enemy.x + enemy.width/2), 2) + Math.pow((this.y + this.height/2 - enemy.y + enemy.height/2), 2) );
                if(dist < 100){
                    console.log(dist);
                    this.setRandomPosition();
                } else {
                    goodPos = true;
                }
                if(this.enemies.length >= i){
                    i = 0;
                }
                i++;
    
            } while (!goodPos);
        }
        
        
        
    }
    update(){
        this.y += this.speed;
        if(this.y >= this.galaxy.height + this.height){
            this.setPosition();
        }
        this.draw();
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