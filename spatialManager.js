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

    return this._nextSpatialID++;
},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();

    this._entities.splice(spatialID,0,entity);
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

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

  for (let i = 0; i < this._entities.length; i++) {
		let ent = this._entities[i];
		if (ent) {
      let pos = ent.getPos();
      var rad = ent.getRadius();
      if(ent.type === "Ground"){
        if (ent.collidesWithGround(posX,posY,radius,radius)) return ent;
      }else {
        let dist = util.distSq(posX,posY,pos.posX,pos.posY);
        var limitSq = util.square(radius + rad);
        if (dist <= limitSq) {
          return ent;
        }
      }

		}
	}
},

render: function(ctx) {
  ctx.save();
  ctx.translate(g_canvas.width/2,g_canvas.height/2);
  var s = entityManager.scale;
  ctx.scale(s,s);
  ctx.translate(-g_canvas.width/2,-g_canvas.height/2);

    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";

    for (var ID in this._entities) {
        var e = this._entities[ID];
        var pos = e.getPos();
        if(e.type != "Ground"){
            util.strokeCircle(ctx, pos.posX, pos.posY, e.getRadius());
        }else {
          //ctx, x, y, w, h, style
          util.fillBox(ctx, pos.posX, pos.posY,e.getWidth(),e.getRadius()*2);
        }

    }
    ctx.strokeStyle = oldStyle;
    ctx.restore();
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
