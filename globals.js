// =======
// GLOBALS
// =======
/*

Evil, ugly (but "necessary") globals, which everyone can use.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Multiply by this to convert seconds into "nominals"
var SECS_TO_NOMINALS = 1000 / NOMINAL_UPDATE_INTERVAL;

var jumpSound = new Audio(
  "sounds/Mario_Jumping.wav"
);

var shotgunPickupSound = new Audio(
  "sounds/reload.wav"
);

var shotgunSound = new Audio(
  "sounds/shotgun.wav"
);

var pistolSound = new Audio(
    "sounds/bulletFire.wav"
  );

var rocketPickupSound = new Audio(
    "sounds/rocketPickup.wav"
  );

var healthPickupSound = new Audio(
  "sounds/healthPickup.wav"
);

var deathSound = new Audio (
  "sounds/death.wav"
);
