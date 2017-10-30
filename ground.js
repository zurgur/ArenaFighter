function Ground(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}
//global wall has a arry that stores the  wall states
var g_ground = new Ground({
  width : 20,
  height : 60,
  cx : 300,
  cy : 470,
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
  if (posY + height/2 > this.cy
      && posX - width/2 < this.cx + this.width
      && posX + width/2 > this.cx
      && posY - height/2 < this.cy + this.height
      ){
        return true;
      } else {
        return false;
      }
}
