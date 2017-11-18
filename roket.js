
"use strict";

function Rocket(descr) {
   this.setup(descr);
   this.sprite = this.sprite || g_sprites.bullet;
   this.radius = 0.5;

   this.fireSound.play();
}
Rocket.prototype = new Entity();

//Hacked in audio
Rocket.prototype.fireSound = new Audio(
  "sounds/Grenade Launcher Sound Effect 1.wav"
);

// Initial, inheritable, default values
Rocket.prototype.rotation = 0;
Rocket.prototype.cx = 200;
Rocket.prototype.cy = 200;
Rocket.prototype.velX = 1;
Rocket.prototype.velY = 1;
Rocket.prototype.type = "Rocket";


Rocket.prototype.update = function (du) {
  spatialManager.unregister(this);
  if (this._isDeadNow) {
    return entityManager.KILL_ME_NOW;
  }
  //this.lifeSpan -= du;
  //if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;

  this.cx += this.velX * du;
  this.cy += this.velY * du;
  this.velY += 0.1;


  this.rotation = util.wrapRange(this.rotation,
                                 0, consts.FULL_CIRCLE);

  this.wrapPosition();


  var hitEntity = this.findHitEntity();
  if (hitEntity) {
      var canTakeHit = hitEntity.takeBulletHit;
      if (canTakeHit) canTakeHit.call(hitEntity);
        entityManager.generateExposion(new Exposion({
          cx : this.cx,
          cy : this.cy,
        }));
        return entityManager.KILL_ME_NOW;

  }
  spatialManager.register(this);
};

Rocket.prototype.getRadius = function () {
    return this.radius;
};

Rocket.prototype.takeBulletHit = function () {
    this.kill();

};

Rocket.prototype.render = function (ctx) {

    var fadeThresh = Bullet.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.radius;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
    ctx.globalAlpha = 1;
};
