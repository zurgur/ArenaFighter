"use strict";

function Pickup(descr) {
    this.setup(descr);
};
//global power upp

Pickup.prototype = new Entity();

Pickup.prototype.cx = 200;
Pickup.prototype.cy = 200;

Pickup.prototype = "Pickup";
//render power_ups
Power.prototype.render = function(ctx){
  var rot = Math.PI / 2 * 3;
  var x = this.cx;
  var y = this.cy;
  var step = Math.PI / 5;
  ctx.strokeSyle = "black";
  ctx.beginPath();
  ctx.moveTo(this.cx, this.cy - 10)
  for (j = 0; j < 5; j++) {
      x = this.cx + Math.cos(rot) * 10;
      y = this.cy + Math.sin(rot) * 10;
      ctx.lineTo(x, y)
      rot += step
      x = this.cx + Math.cos(rot) * 5;
      y = this.cy + Math.sin(rot) * 5;
      ctx.lineTo(x, y)
      rot += step
  }
  ctx.lineTo(this.cx, this.cy - 10)
  ctx.closePath();
  ctx.lineWidth=5;
  //if make paddle big gold star
  ctx.strokeStyle='orange';
  ctx.fillStyle='Gold';
  ctx.stroke();
  ctx.fill();
};
//update  power ups
Pickup.prototype.update = function(du){
  spatialManager.unregister(this);
  spatialManager.register(this);
};