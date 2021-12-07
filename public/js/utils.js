function randomBetweenNumbers(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkCollision(obj1,obj2){

    var dx = (obj1.x + obj1.width/2) - (obj2.x + obj2.width/2);
    var dy = (obj1.y + obj1.width/2) - (obj2.y + obj2.width/2);
    var distance = Math.sqrt(dx * dx + dy * dy);

    return distance < obj1.width/2 + obj2.width/2;
}