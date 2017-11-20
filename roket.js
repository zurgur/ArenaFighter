
"use strict";

function Rocket(descr) {
   this.setup(descr);
   this.sprite = this.sprite || g_sprites.bullet;
   this.radius = 0.5;
   this.trail = [];
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
  //unregiser so it wont afect the other tests
  spatialManager.unregister(this);
  if (this._isDeadNow) {
    return entityManager.KILL_ME_NOW;
  }
  //update the x and y of the Rocket
  this.cx += this.velX * du;
  this.cy += this.velY * du;
  this.velY += 0.1;

  this.rotation = util.wrapRange(this.rotation,
                                 0, consts.FULL_CIRCLE);
  //wrap if need be
  this.wrapPosition();

  //if the bullet hits somthing it Exposion
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
  //sets the x and y at the front off the arry
  this.trail.unshift([this.cx,this.cy]);
  //clamp the trail length
  if(this.trail.length > 40){
    this.trail.length = 40;
  }

  //re regiser
  spatialManager.register(this);
};
//returns the rasius for use in the spatialManager
Rocket.prototype.getRadius = function () {
    return this.radius;
};
//if the rocket takes a bullet hit
Rocket.prototype.takeBulletHit = function () {
    this.kill();
};
//renders the roket
Rocket.prototype.render = function (ctx) {
    //save the original scale for later use
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.radius;
    this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );
    //change the scale back to original scale
    this.sprite.scale = origScale;

  for(var i = 0 ; i<this.trail.length;i++){
    var x = this.trail[i][0];
    var y = this.trail[i][1];
    ctx.fillStyle = 'red';
    util.fillCircle(ctx,x,y,7 - i/8);
  }
};
