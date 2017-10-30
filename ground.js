function Ground(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}
//global wall has a arry that stores the  wall states
var g_ground = new Ground({
  width : 20,
  height : 20,
  cx : 100,
  cy : 500,
});


//draw the bricks
Ground.prototype.drawBricks = function(ctx){
  ctx.beginPath();
  ctx.rect(this.cx, this.cy, this.width, this.height);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}


Ground.prototype.collidesWithGround = function(posX,posY,width,height){
  if (posY+height/2 > this.cy && posY - height/2 < this.cy &&
      (posX + width/2 > this.cx && posX - width/2 < this.cx + this.width)){
        console.log("collided with top");
        return true;
      } else {
        return false;
      }
}
