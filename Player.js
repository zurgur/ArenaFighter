// ==========
// Player STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Player(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.ship;

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this.jump = false;
    this.hanging = false;
    this.life = 5;
    this.lastDirection = "right";
    this.savePos = [[200,200],[1400,200],[470,500]];
    this.playerId = 1;
    this._gunType = "pistol";
    this.canFire = true;
};

Player.prototype = new Entity();

Player.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_rotation = this.rotation;
};
Player.prototype.setKeys = function(i){
  if(i ===1){
    this.KEY_THRUST = 'W'.charCodeAt(0);
    this.KEY_RETRO  = 'S'.charCodeAt(0);
    this.KEY_LEFT   = 'A'.charCodeAt(0);
    this.KEY_RIGHT  = 'D'.charCodeAt(0);
    this.KEY_FIRE   = 'E'.charCodeAt(0);
  }else{
    this.KEY_THRUST = 'I'.charCodeAt(0);
    this.KEY_RETRO  = 'K'.charCodeAt(0);
    this.KEY_LEFT   = 'J'.charCodeAt(0);
    this.KEY_RIGHT  = 'L'.charCodeAt(0);
    this.KEY_FIRE   = 'O'.charCodeAt(0);
    this.playerId = 2
    this.sprite = g_sprites.ship2;
  }

};


// Initial, inheritable, default values
Player.prototype.rotation = 0;
Player.prototype.cx = 200;
Player.prototype.cy = 200;
Player.prototype.velX = 0;
Player.prototype.velY = 0;
Player.prototype.launchVel = 2;
Player.prototype.numSubSteps = 1;
Player.prototype.height = 62;
Player.prototype.width = 40;
Player.prototype.type = "Player";
/*
// HACKED-IN AUDIO (no preloading)
Player.prototype.warpSound = new Audio(
    "sounds/ShipWarp.ogg");
*/


Player.prototype._moveToASafePlace = function () {

    // Move to a safe place some suitable distance away
    var origX = this.cx,
        origY = this.cy,
        MARGIN = 40,
        isSafePlace = false;

    for (var attempts = 0; attempts < 100; ++attempts) {

        var warpDistance = 100 + Math.random() * g_canvas.width /2;
        var warpDirn = Math.random() * consts.FULL_CIRCLE;

        this.cx = origX + warpDistance * Math.sin(warpDirn);
        this.cy = origY - warpDistance * Math.cos(warpDirn);

        this.wrapPosition();

        // Don't go too near the edges, and don't move into a collision!
        if (!util.isBetween(this.cx, MARGIN, g_canvas.width - MARGIN)) {
            isSafePlace = false;
        } else if (!util.isBetween(this.cy, MARGIN, g_canvas.height - MARGIN)) {
            isSafePlace = false;
        } else {
            isSafePlace = !this.isColliding();
        }

        // Get out as soon as we find a safe place
        if (isSafePlace) break;

    }
};

Player.prototype.update = function (du) {
    var minY = g_sprites.ship.height / 2;
    var maxY = g_canvas.height - minY - 44;

    if (this.cy+1 < maxY && !spatialManager.groundCollision(this.cx, this.cy+1, this.width-10, this.height)){
      this.jump = false;
    } else {
      this.jump = true;
    }
    //player is no longer hanging if he is moving up or down
    if (this.velY !== 0){
      this.hanging = false;
    }

    // Handle warping


    // TODO: YOUR STUFF HERE! --- Unregister and check for death
    spatialManager.unregister(this);
    if (this._isDeadNow) {
      return entityManager.KILL_ME_NOW;
    }
    // Perform movement substeps
    var steps = this.numSubSteps;
    var dStep = du / steps;
    for (var i = 0; i < steps; ++i) {
        this.computeSubStep(dStep);
    }

    // Handle firing
    this.maybeFireBullet();

    // TODO: YOUR STUFF HERE! --- Warp if isColliding, otherwise Register
    var x = spatialManager.findEntityInRange(this.cx,this.cy,this.getRadius());

    spatialManager.register(this);

};

Player.prototype.computeSubStep = function (du) {

    var thrust = this.computeThrustMag();

    // Apply thrust directionally, based on our rotation
    var accelX = +Math.sin(this.rotation) * thrust;
    var accelY = -Math.cos(this.rotation) * thrust;
    accelY += this.computeGravity();
    this.applyAccel(accelX, accelY, 1);

    this.wrapPosition();

    if (thrust === 0 || g_allowMixedActions) {
        this.updateRotation(du);
    }
};

var NOMINAL_GRAVITY = 0.2;

Player.prototype.computeGravity = function () {
    return g_useGravity ? NOMINAL_GRAVITY : 0;
};

var NOMINAL_JUMP = 7;

Player.prototype.computeThrustMag = function () {
    var thrust = 0;
    if ((keys[this.KEY_THRUST]) && this.jump){
        this.jump = false;
        thrust += NOMINAL_JUMP;
    } else if ((keys[this.KEY_THRUST]) && this.hanging) {

          thrust = NOMINAL_JUMP;
      }



    return thrust;
};

Player.prototype.applyAccel = function (accelX, accelY, du) {
    // u = original velocity
    var oldVelX = this.velX;
    var oldVelY = this.velY;

    // v = u + at
    this.velX += accelX * du;
    this.velY += accelY * du;

    // v_ave = (u + v) / 2
    var aveVelX = (oldVelX + this.velX) / 2;
    var aveVelY = (oldVelY + this.velY) / 2;

    // Decide whether to use the average or not (average is best!)
    var intervalVelX = g_useAveVel ? aveVelX : this.velX;
    var intervalVelY = g_useAveVel ? aveVelY : this.velY;

    // s = s + v_ave * t
    var nextX = this.cx + intervalVelX * du;
    var nextY = this.cy + intervalVelY * du;
    // bounce
    if (g_useGravity) {

	      var minY = g_sprites.ship.height / 2;
	      var maxY = g_canvas.height - minY - 44;

	       // Ignore the bounce if the Player is already in
	        // the "border zone" (to avoid trapping them there)
	         if (this.cy > maxY || this.cy < minY) {
	            // do nothing
            } else if (nextY > maxY || nextY < minY || spatialManager.groundCollision(nextX, nextY, this.width, this.height)) {
               if(nextY < this.cy && spatialManager.groundCollision(nextX, nextY, this.width, this.height)){
                 this.hanging = true;
               }
               this.velY = 0;
               intervalVelY = this.velY;
             }
           }

    // s = s + v_ave * t
    this.cx += du * intervalVelX;
    this.cy += du * intervalVelY;
};

Player.prototype.firePistol = function () {
  var dX = +Math.sin(this.rotation);
  var dY = -Math.cos(this.rotation);
  var launchDist = this.getRadius() * 1.2;

  var relVel = this.launchVel;
  var relVelX = dX * relVel;
  var relVelY = dY * relVel;

  if(this.lastDirection==="right"){
    entityManager.fireBullet(
      this.cx + dX * launchDist +30, this.cy + dY * launchDist+40,
      10,0,
      1.5);
   }else{
     entityManager.fireBullet(
       this.cx + dX * launchDist -30, this.cy + dY * launchDist+40,
       -10,0,
       -1.5);
   }
}

Player.prototype.fireShotgun = function () {
  var dX = +Math.sin(this.rotation);
  var dY = -Math.cos(this.rotation);
  var launchDist = this.getRadius() * 1.2;

  var relVel = this.launchVel;
  var relVelX = dX * relVel;
  var relVelY = dY * relVel;

  if(this.lastDirection==="right"){

    entityManager.fireBullet(
      this.cx + dX * launchDist +30, this.cy + dY * launchDist+50,
      10,0.5,
      1.5);
   entityManager.fireBullet(
     this.cx + dX * launchDist +30, this.cy + dY * launchDist+40,
     10,0,
     1.5);
   entityManager.fireBullet(
     this.cx + dX * launchDist +30, this.cy + dY * launchDist+30,
     10,-0.5,
     1.5);
   }else{
     entityManager.fireBullet(
       this.cx + dX * launchDist -30, this.cy + dY * launchDist+50,
       -10,0.5,
       -1.5);
    entityManager.fireBullet(
      this.cx + dX * launchDist -30, this.cy + dY * launchDist+40,
      -10,0,
      -1.5);
    entityManager.fireBullet(
      this.cx + dX * launchDist -30, this.cy + dY * launchDist+30,
      -10,-0.5,
      -1.5);
    }
  }


Player.prototype.maybeFireBullet = function () {

    if (keys[this.KEY_FIRE] && this.canFire) {
        console.log(this.canFire);
        this.canFire = false;

        if(this._gunType === "pistol"){

          this.firePistol();

       }else if (this._gunType === "rocketLauncher") {
         var self = this;
         var spray = 5;
         function foo(){
          if (spray > 0){
            self.firePistol();
            spray--;
            setTimeout( foo, 100 );
          }
        }
        foo();

       }else if (this._gunType === "shotgun") {
         this.fireShotgun();
       }
       var self = this;
       setTimeout(function () {
         self.canFire = true;
       }, 1000);
     }


};

Player.prototype.getRadius = function () {
    return (this.sprite.height / 2) * 0.9;
};

Player.prototype.takeBulletHit = function () {
    var rand = Math.floor(Math.random()*3);
    this.cx = this.savePos[rand][0];
    this.cy = this.savePos[rand][1];
    this.life--;
    console.log(this.life);
    if(this.life === 0){
      console.log("dead");
      this._isDeadNow = true;
    }
};

Player.prototype.takePickup = function (type) {
  if(type === "helth"){
    this.life ++;
    console.log("now my helth is" + this.life);
  }else if (type === "shotgun") {
    this._gunType = "shotgun";
  }else if (type === "rocketLauncher") {
    this._gunType = "rocketLauncher";
  }
  var self = this;
  setTimeout(function () {
    self._gunType = "pistol";
  }, 10000);

}

Player.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.rotation = this.reset_rotation;

    this.halt();
};

Player.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

var NOMINAL_MOVEMENT_RATE = 3;

Player.prototype.updateRotation = function (du) {
    var rate = NOMINAL_MOVEMENT_RATE * du;
    if (keys[this.KEY_LEFT]) {
        this.lastDirection = "left";
        if (!spatialManager.groundCollision(this.cx-rate, this.cy, this.width, this.height)){
          this.cx -= NOMINAL_MOVEMENT_RATE * du;
        }
    }
    if (keys[this.KEY_RIGHT]){
      this.lastDirection = "right";
      if (!spatialManager.groundCollision(this.cx+rate, this.cy, this.width, this.height)){
        this.cx += NOMINAL_MOVEMENT_RATE * du;
      }
    }
};

Player.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawWrappedCentredAt(
	ctx, this.cx, this.cy, this.rotation
    );
    this.sprite.scale = origScale;
};
