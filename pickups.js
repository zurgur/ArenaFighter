"use strict";

function Pickup(descr) {
    this.setup(descr);
    this.sprite = this.sprite || g_sprites.cake;
    this._scale = 2;
};
//global power upp

Pickup.prototype = new Entity();

Pickup.prototype.cx = 200;
Pickup.prototype.cy = 200;

Pickup.prototype.type = "Pickup";
//render power_ups
Pickup.prototype.render = function(ctx){

  var origScale = this.sprite.scale;
  // pass my scale into the sprite, for drawing
  this.sprite.scale = this._scale;
  this.sprite.drawWrappedCentredAt(
ctx, this.cx, this.cy, this.rotation
  );
  this.sprite.scale = origScale;
};
Pickup.prototype.getRadius = function (){
  return(this.sprite.height/2) * 1.9;
}
//update  power ups
Pickup.prototype.update = function(du){
  spatialManager.unregister(this);
  if(this._isDeadNow) {
    return entityManager.KILL_ME_NOW;
  }
  var hitEntity = this.findHitEntity();
  if(hitEntity) {
    var canTakePickup = hitEntity.takePickup;
    if(canTakePickup){
      if(this.sprite === g_sprites.shotgun){
        hitEntity.takePickup("shotgun");
      }else if (this.sprite === g_sprites.rocketLauncher) {
        hitEntity.takePickup("rocketLauncher");
      }else if (this.sprite === g_sprites.uzi) {
        hitEntity.takePickup("uzi");
      }else {
        hitEntity.takePickup("helth");
      }

      canTakePickup.call(hitEntity);
      return entityManager.KILL_ME_NOW;
    }
  }

  spatialManager.register(this);
};
