/*
entityManager.js
A module which handles arbitrary entity-management for "Asteroids"
We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.
"Private" properties are denoted by an underscore prefix convention.
*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_players   : [],
_bullets : [],
_playerId : 1,
_grounds : [],
_pickups : [],
_rockets : [],
_exposions : [],
// "PRIVATE" METHODS

_generatePlayers : function() {
    var i,
        NUM_PLAYERS = 1;

    for (i = 0; i < NUM_PLAYERS-1; ++i) {
        this.generatePlayer();
    }
},


_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._players, this._bullets, this._grounds,this._pickups,this._rockets,this._exposions];
},

destroyPlayers : function () {
  this._players = [];
  this._playerId = 1;
},

init: function() {
    this._generatePlayers();
    //this._generateShip();
},

fireBullet: function(cx, cy, velX, velY, rotation) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,

        rotation : rotation
    }));
},
fireRocket: function(cx, cy, velX, velY, rotation) {
    this._rockets.push(new Rocket({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,

        rotation : rotation
    }));
},


generatePlayer : function(descr) {
  var p = new Player(descr);
  p.setKeys(this._playerId);
    this._players.push(p);
    this._playerId++;
},

generateGrounds : function(descr) {
  this._grounds.push(new Ground(descr));
},
generatePickups : function(descr) {
  this._pickups.push(new Pickup(descr));
},
generateExposion : function (descr) {
  this._exposions.push(new Exposion(descr));
},


update: function(du) {
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {
            var status = aCategory[i].update(du);
            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                if(aCategory[0].type === "Player"){
                  if(aCategory[i].playerId === 2){
                    wictory("Player 1");
                  }else {
                    wictory("Player 2");
                  }
                }
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }

},

render: function(ctx) {
    ctx.save();
    if(this._players.length ===2){
      var s = Scale.Camera(ctx, this._players[0],this._players[1]);
      var p = Scale.Point(this._players[0],this._players[1]);
      ctx.translate(g_canvas.width/2,g_canvas.height/2);
      ctx.scale(s,s);
      ctx.translate(-g_canvas.width/2,-g_canvas.height/2);
    }

    //ctx.translate(p.x*s,p.y*s);

    g_sprites.back.drawBackrond(ctx,g_prevUpdateDu);

    var debugX = 10, debugY = 100;
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }

    ctx.restore();
    this._players[0].drawHealth(ctx);
    this._players[1].drawHealth(ctx);
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
