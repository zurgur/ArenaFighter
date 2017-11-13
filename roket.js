
"use strict";

function Rocket(descr) {
   this.setup(descr);

}
Rocket.prototype = new Entity();

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


    this.cx += this.velX * du;
    this.cy += this.velY * du;
    this.velY += .01;


    this.rotation = util.wrapRange(this.rotation,
                                   0, consts.FULL_CIRCLE);

    this.wrapPosition();


    var hitEntity = this.findHitEntity();
    if (hitEntity) {
        var canTakeHit = hitEntity.takeBulletHit;
        if (canTakeHit) canTakeHit.call(hitEntity);
        return entityManager.KILL_ME_NOW;
    }else if (spatialManager.groundCollision(this.posX,this.posY,10,10)) {
      return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);

};

Rocket.prototype.getRadius = function () {
    return 4;
};

Rocket.prototype.takeBulletHit = function () {
    this.kill();

};

Rocket.prototype.render = function (ctx) {

    var fadeThresh = Bullet.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }

    g_sprites.bullet.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );

    ctx.globalAlpha = 1;
};
