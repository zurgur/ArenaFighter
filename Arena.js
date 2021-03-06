// =========
// ASTEROIDS
// =========
/*

A sort-of-playable version of the classic arcade game.


HOMEWORK INSTRUCTIONS:

You have some "TODO"s to fill in again, particularly in:

spatialManager.js

But also, to a lesser extent, in:

Rock.js
Bullet.js
Ship.js


...Basically, you need to implement the core of the spatialManager,
and modify the Rock/Bullet/Ship to register (and unregister)
with it correctly, so that they can participate in collisions.

Be sure to test the diagnostic rendering for the spatialManager,
as toggled by the 'X' key. We rely on that for marking. My default
implementation will work for the "obvious" approach, but you might
need to tweak it if you do something "non-obvious" in yours.
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// ====================
// CREATE INITIAL SHIPS
// ====================

function createInitialPlayers() {
    entityManager.generatePlayer({
      cx : 200,
      cy : 200,
    });
    entityManager.generatePlayer({
      cx : 1400,
      cy : 200
    });

}

function createInitialGrounds(cx,cy,w,h) {

    cx = cx - w/2;
    cy = cy - h/2;

  entityManager.generateGrounds(new Ground({
    width : w,
    height : h,
    cx : cx,
    cy : cy
  }));
}
function createInitialPickups(cx,cy,sprite){
  if(sprite){
    entityManager.generatePickups(new Pickup({
      cx : cx,
      cy : cy,
      sprite: sprite
    }));
  }else {
    entityManager.generatePickups(new Pickup({
      width : 2,
      height : 2,
      cx : cx,
      cy : cy,
    }));
  }

}


// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();

    entityManager.update(du);

    // Prevent perpetual firing!
    eatKey(Player.prototype.KEY_FIRE);
}

// GAME-SPECIFIC DIAGNOSTICS
var g_allowMixedActions = true;
var g_useGravity = true;
var g_useAveVel = true;
var g_renderSpatialDebug = false;

var KEY_MIXED   = keyCode('M');
var KEY_GRAVITY = keyCode('G');
var KEY_AVE_VEL = keyCode('V');
var KEY_SPATIAL = keyCode('X');

var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');


function processDiagnostics() {

    if (eatKey(KEY_MIXED))
        g_allowMixedActions = !g_allowMixedActions;

    if (eatKey(KEY_GRAVITY)) g_useGravity = !g_useGravity;

    if (eatKey(KEY_AVE_VEL)) g_useAveVel = !g_useAveVel;

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;


}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`

// GAME-SPECIFIC RENDERING
function renderSimulation(ctx) {
    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        info : "sprites/Info.png",
        StartScreen: "sprites/StartScreen.png",
        player   : "sprites/playerSprite.png",
        bullet : "sprites/BulletIcon.png",
        img    : "sprites/parallax.png",
        player2  : "sprites/player2Sprite.png",
        revPlayer2  : "sprites/revplayer2Sprite.png",
        revPlayer  : "sprites/revplayerSprite.png",
        cake   : "sprites/cake.png",
        rocketLauncher : "sprites/rocketLauncher.png",
        shotgun: "sprites/ShotGun.png",
        uzi :    "sprites/SMG.png",
        revShotgun: "sprites/revShotGun.png",
        heart: "sprites/heart.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}


var g_sprites = {};

function preloadDone() {
    g_sprites.back = new Background(g_images.img);
    g_sprites.info = new Sprite(g_images.info);
    g_sprites.StartScreen = new Sprite(g_images.StartScreen);
    g_sprites.heart = new Sprite(g_images.heart);
    g_sprites.player  = new Sprite(g_images.player);
    g_sprites.player2 = new Sprite(g_images.player2);
    g_sprites.playerrev = new Sprite(g_images.revPlayer);
    g_sprites.player2rev = new Sprite(g_images.revPlayer2);
    g_sprites.cake  = new Sprite(g_images.cake);
    g_sprites.rocketLauncher = new Sprite(g_images.rocketLauncher);
    g_sprites.shotgun = new Sprite(g_images.shotgun);
    g_sprites.uzi = new Sprite(g_images.uzi);
    g_sprites.shotgunrev = new Sprite(g_images.revShotgun);
    g_sprites.bullet = new Sprite(g_images.bullet);
    g_sprites.bullet.scale = 0.25;
    g_sprites.StartScreen.drawWrappedCentredAt(
    context, 801, 400, 0
    );
    g_sprites.info.drawWrappedCentredAt(instructCTX,801,100,0);
    entityManager.init();
    createInitialPlayers();

    createInitialGrounds(200, 550, 200, 15);
    createInitialGrounds(1600-200, 550, 200, 15);
    createInitialGrounds(800, 650, 600, 15);

    createInitialGrounds(430, 530, 20, 15);
    createInitialGrounds(1600-430, 530, 20, 15);

    createInitialGrounds(360, 610, 20, 15);
    createInitialGrounds(1600-360, 610, 20, 15);

    createInitialGrounds(30, 650, 20, 15);
    createInitialGrounds(1600 - 30, 650, 20, 15);

    createInitialGrounds(350, 350, 400, 15);
    createInitialGrounds(1600 - 350, 350, 400, 15);

    createInitialGrounds(600, 470, 180, 15);
    createInitialGrounds(1600 - 600, 470, 180, 15);

    createInitialGrounds(800, 360, 150, 15);

    createInitialGrounds(800, 0, 1600, 15);

    createInitialGrounds(800, 550, 100, 15);

    createInitialGrounds(50, 380, 20, 15);
    createInitialGrounds(1600-50, 380, 20, 15);

    createInitialGrounds(200, 250, 20, 15);
    createInitialGrounds(400, 250, 20, 15);
    createInitialGrounds(600, 250, 20, 15);
    createInitialGrounds(800, 250, 20, 15);
    createInitialGrounds(1000, 250, 20, 15);
    createInitialGrounds(1200, 250, 20, 15);
    createInitialGrounds(1400, 250, 20, 15);

    createInitialGrounds(100, 165, 20, 15);
    createInitialGrounds(300, 165, 20, 15);
    createInitialGrounds(500, 165, 20, 15);
    createInitialGrounds(700, 165, 20, 15);
    createInitialGrounds(900, 165, 20, 15);
    createInitialGrounds(1100, 165, 20, 15);
    createInitialGrounds(1300, 165, 20, 15);
    createInitialGrounds(1500, 165, 20, 15);

    createInitialGrounds(200, 80, 20, 15);
    createInitialGrounds(800, 80, 20, 15);
    createInitialGrounds(1400, 80, 20, 15);

    createInitialGrounds(800, 790, 1600, 100);

    main.init();
}

// Kick it off
requestPreloads();
