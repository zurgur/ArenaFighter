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
  ctx.fillStyle = "#663300";
  ctx.fill();
  ctx.closePath();
};

Ground.prototype.update = function (du) {
  spatialManager.unregister(this);
  spatialManager.register(this);
};


Ground.prototype.collidesWithGround = function(posX,posY,width,height){
  var halfWidth = width/2;
  var halfHeight = height/2;
  if (posY + halfHeight > this.cy
      && posX - halfWidth < this.cx + this.width
      && posX + halfWidth > this.cx
      && posY - halfHeight < this.cy + this.height
      ){
        return true;
      } else {
        return false;
      }
};
