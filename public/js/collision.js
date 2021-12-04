class Collision{
    checkCollision(player,collisions){
        let dist;
        for(const col of collisions){
            dist = Math.sqrt( Math.pow(((player.x + player.width/2) - (col.x + col.width/2)), 2) + Math.pow(((player.y + player.height/2) - (col.y + col.height/2)), 2) );
            if(dist < player.width){
                col.color = "#00ff00";
            }
        }
    }
}