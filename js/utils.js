function randomBetweenNumbers(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function degreesToRadians(degrees){
  var pi = Math.PI;
  return degrees * (pi/180);
}

function checkCollision(obj1,obj2){

    var a = obj1.x - obj2.x;
    var b = obj1.y - obj2.y;
    var c = (a * a) + (b * b);
    var radii = obj1.width/2 + obj2.width/2;
    
    return radii * radii >= c;
}