
"use strict";

function Exposion(descr) {
  this.setup(descr);
  this.sprite = this.sprite || g_sprites.cake;
  this.sound.play();
};

Exposion.prototype = new Entity();
//HACKED in AUDIO
Exposion.prototype.sound = new Audio(
  "sounds/Explosion Sound.wav"
);
Exposion.prototype.radius = 1;

Exposion.prototype.render = function (ctx) {
  ctx.strokeStyle = "red";
  ctx.lineWidth = this.radius/2;
  util.strokeCircle(ctx, this.cx, this.cy, this.radius);
};

Exposion.prototype.update = function(du){
  spatialManager.unregister(this);
  this.radius += 2.4 * du;
  if(this.radius > 70){
    return entityManager.KILL_ME_NOW;
  }
  var hitEntity = this.findHitEntity();
  if (hitEntity) {
      var canTakeHit = hitEntity.takeBulletHit;
      if (canTakeHit) canTakeHit.call(hitEntity);
  }
  spatialManager.register(this);
};

Exposion.prototype.getRadius = function () {
  return this.radius;
}
