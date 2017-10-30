/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {

    // TODO: YOUR STUFF HERE!

    return this._nextSpatialID++;
},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();

    // TODO: YOUR STUFF HERE!
    this._entities.splice(spatialID,0,entity);
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    // TODO: YOUR STUFF HERE!
    for (let i = 0; i < this._entities.length; i++) {
      let ent = this._entities[i];
      if (ent instanceof Entity) {
        if (ent.getSpatialID() == entity.getSpatialID()) {
          this._entities.splice(i, 1);
          break;
        }
      }
    }

},

findEntityInRange: function(posX, posY, radius) {

    // TODO: YOUR STUFF HERE!
  for (let i = 0; i < this._entities.length; i++) {
		let ent = this._entities[i];
		if (ent) {
			let pos = ent.getPos();
      var rad = ent.getRadius();
			let dist = util.distSq(posX,posY,pos.posX,pos.posY);
      var limitSq = util.square(radius + rad);
			if (dist <= limitSq) {
				return ent;
			}
		}
	}
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";

    for (var ID in this._entities) {
        var e = this._entities[ID];
        var pos = e.getPos();
        util.strokeCircle(ctx, pos.posX, pos.posY, e.getRadius());
    }
    ctx.strokeStyle = oldStyle;
},

groundCollision: function(posX,posY,width,height){

    for (var i = 0; i < this._entities.length; i++){
      if (this._entities[i].type === "Ground") {
        if (this._entities[i].collidesWithGround(posX,posY,width,height)) return true;
      }
    }
    return false;
}
}
