"use strict";

function Ground(descr) {
    this.setup(descr);
};

Ground.prototype = new Entity();

Ground.prototype.type = "Ground";
//draw the bricks
Ground.prototype.render = function(ctx){
  ctx.beginPath();
  ctx.rect(this.cx, this.cy, this.width, this.height);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
};

Ground.prototype.update = function (du) {
  spatialManager.unregister(this);
  spatialManager.register(this);
};


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
};
