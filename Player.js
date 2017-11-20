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
    this.sprite = this.sprite || g_sprites.player;

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this.jump = false;
    this.hanging = false;
	this.still = false;
    this.life = 5;
    this.lastDirection = "right";
    this.savePos = [[200,200],[1400,200],[470,500],[1000,600],[1000,1000]];
    this._index = 20;
    this.playerId = 1;
    this._gunType = "pistol";
    this.canFire = true;
    this.gunSprite = g_sprites.shotgunrev;
    this.counter = 0;
    this.animations = 0;

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
    this.KEY_ALTFIRE = 'Q'.charCodeAt(0);
  }else{
    this.KEY_THRUST = 'I'.charCodeAt(0);
    this.KEY_RETRO  = 'K'.charCodeAt(0);
    this.KEY_LEFT   = 'J'.charCodeAt(0);
    this.KEY_RIGHT  = 'L'.charCodeAt(0);
    this.KEY_FIRE   = 'O'.charCodeAt(0);
    this.KEY_ALTFIRE = 'U'.charCodeAt(0);
    this.playerId = 2
    this.sprite = g_sprites.player2;
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



Player.prototype.update = function (du) {
    var minY = this.sprite.height / 2;
    var maxY = g_canvas.height - minY;
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
    var accelY = -thrust;
    //console.log(this.computeGravity());
    accelY += this.computeGravity();
    this.applyAccel(0, accelY, 1);

    this.wrapPosition();

    if (thrust === 0 || g_allowMixedActions) {
        this.updateMovement(du);
    }
};

var NOMINAL_GRAVITY = 0.2;

Player.prototype.computeGravity = function () {
    return g_useGravity ? NOMINAL_GRAVITY : 0;
};

var NOMINAL_JUMP = 7.5;

Player.prototype.computeThrustMag = function () {
    var thrust = 0;
    if ((keys[this.KEY_THRUST]) && this.jump){
        this.jump = false;
        jumpSound.play();
        thrust = NOMINAL_JUMP;
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

	      var minY = this.sprite.height / 2 - 54;
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
      this.cx + dX * launchDist +40, this.cy + dY * launchDist+40,
      10,0,
      1.5);
   }else{
     entityManager.fireBullet(
       this.cx + dX * launchDist -40, this.cy + dY * launchDist+40,
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
      this.cx + dX * launchDist +40, this.cy + dY * launchDist+50,
      10,0.2,
      1.5);
   entityManager.fireBullet(
     this.cx + dX * launchDist +40, this.cy + dY * launchDist+40,
     10,0,
     1.5);
   entityManager.fireBullet(
     this.cx + dX * launchDist +40, this.cy + dY * launchDist+30,
     10,-0.2,
     1.5);
   }else{
     entityManager.fireBullet(
       this.cx + dX * launchDist -40, this.cy + dY * launchDist+50,
       -10,0.2,
       -1.5);
    entityManager.fireBullet(
      this.cx + dX * launchDist -40, this.cy + dY * launchDist+40,
      -10,0,
      -1.5);
    entityManager.fireBullet(
      this.cx + dX * launchDist -40, this.cy + dY * launchDist+30,
      -10,-0.2,
      -1.5);
    }
    shotgunSound.play();
  }


Player.prototype.maybeFireBullet = function () {

    if ((keys[this.KEY_FIRE] || keys[this.KEY_ALTFIRE]) && this.canFire) {
        this.canFire = false;

        if(this._gunType === "pistol"){

          this.firePistol();
          pistolSound.play();
       }else if (this._gunType === "rocketLauncher") {

        var dX = +Math.sin(this.rotation);
        var dY = -Math.cos(this.rotation);
        var launchDist = this.getRadius() * 1.2;

        var relVel = this.launchVel;
        var relVelX = dX * relVel;
        var relVelY = dY * relVel;
        if(this.lastDirection=== "right"){
          entityManager.fireRocket(
            this.cx + dX * launchDist +30, this.cy + dY * launchDist+30,
            10,-0.5,
            1.5);
        }else{
        entityManager.fireRocket(
          this.cx + dX * launchDist -30, this.cy + dY * launchDist+30,
          -10,-0.5,
          -1.5);
        }
       }else if (this._gunType === "shotgun") {
         this.fireShotgun();
       }else if(this._gunType === "uzi"){
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
        uziSound.play();
       }
       var self = this;
       setTimeout(function () {
         self.canFire = true;
       }, 1200);
     }


};

Player.prototype.getRadius = function () {
    return (this.sprite.height / 5) * 0.9;
};

Player.prototype.takeBulletHit = function () {
    var rand = Math.floor(Math.random()*5);
    this._index = rand;
    this.cx = this.savePos[rand][0];
    this.cy = this.savePos[rand][1];
    this.life--;
    if(this.life === 0){
      this._isDeadNow = true;
    }
    deathSound.play();
};

var pistolReset = null;

Player.prototype.takePickup = function (type) {
  if(type === "helth"){
    this.life ++;
    healthPickupSound.play();
    spawnHealth = true;
    return;
  }else if (type === "shotgun") {
    this._gunType = "shotgun";
    shotgunPickupSound.play();
    spawnWeapon = true;
  }else if (type === "rocketLauncher") {
    this._gunType = "rocketLauncher";
    rocketPickupSound.play()
    spawnWeapon = true;
  }else if (type === "uzi") {
    this._gunType = "uzi";
  }

  clearTimeout(pistolReset);
  var self = this;
  pistolReset = setTimeout(function () {
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
var idleReset = null;

Player.prototype.updateMovement = function (du) {
    var rate = NOMINAL_MOVEMENT_RATE * du;
    if (keys[this.KEY_LEFT]) {
        this.lastDirection = "left";
        this.counter ++;
        if(this.jump || this.hanging){
          this.animations = Math.floor((this.counter)/10 * du);
        }
        this.gunSprite = g_sprites.shotgun;

        if(this.playerId === 1){
          this.sprite = g_sprites.playerrev;
        }else {
          this.sprite = g_sprites.player2rev;

        }
        if (!spatialManager.groundCollision(this.cx-rate, this.cy, this.width, this.height)){
          this.cx -= NOMINAL_MOVEMENT_RATE * du;
        }
		clearTimeout(idleReset);
		this.still = false;
		var self = this;
		idleReset = setTimeout(function () {
		self.still = true;
	  }, 200);
    }
    if (keys[this.KEY_RIGHT]){
      this.lastDirection = "right";
      this.gunSprite = g_sprites.shotgunrev;
      if(this.jump || this.hanging){
        this.counter ++;
        this.animations = Math.floor((this.counter)/10 * du);
      }
      if(this.playerId === 1){
        this.sprite = g_sprites.player;
      }else {
        this.sprite = g_sprites.player2;
      }
      if (!spatialManager.groundCollision(this.cx+rate, this.cy, this.width, this.height)){
        this.cx += NOMINAL_MOVEMENT_RATE * du;
      }
	  clearTimeout(idleReset);
	  this.still = false;
	  var self = this;
	  idleReset = setTimeout(function () {
		self.still = true;
	  }, 200);
    }

};

Player.prototype.drawHealth = function (ctx){
  if (this.playerId === 1){
    var x = 60;
    for (var i = 0; i < this.life; i++){
      g_sprites.heart.drawWrappedCentredAt(ctx,x, 753);
      x += 60;
    }
  } else {
      var x = 1530;
      for (var i = 0; i < this.life; i++){
        g_sprites.heart.drawWrappedCentredAt(ctx,x, 753);
        x -= 60;
    }
  }
};

Player.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    ctx.save()
    if (this.hanging){
      ctx.translate(this.cx,this.cy);
      ctx.scale(1,-1);
      ctx.translate(-this.cx,-this.cy);
    }
    this.sprite.drawFrameAt(
	ctx, this.cx, this.cy, this.rotation,0,this.animations, this.still
    );

    this.gunSprite.drawWrappedCentredAt(
      ctx, this.cx, this.cy+10, this.rotation
    );
    ctx.restore();
    this.sprite.scale = origScale;
};
