// GENERIC UPDATE LOGIC

// The "nominal interval" is the one that all of our time-based units are
// calibrated to e.g. a velocity unit is "pixels per nominal interval"
//
var NOMINAL_UPDATE_INTERVAL = 16.666;

// Dt means "delta time" and is in units of the timer-system (i.e. milliseconds)
//
var g_prevUpdateDt = null;

// Du means "delta u", where u represents time in multiples of our nominal interval
//
var g_prevUpdateDu = null;

// Track odds and evens for diagnostic / illustrative purposes
//
var g_isUpdateOdd = false;

var g_playMusic = false;

var KEY_MUTE = 'M'.charCodeAt(0);

function update(dt) {

    // Get out if skipping (e.g. due to pause-mode)
    //
    if (shouldSkipUpdate()) return;
    if(eatKey(KEY_MUTE)){
      g_playMusic=!g_playMusic;
      if (g_playMusic) soundtrack.volume = 0;
      else soundtrack.volume = 0.4;
      //soundtrack.currentTime = 0;
    }

    // Remember this for later
    //
    var original_dt = dt;

    // Warn about very large dt values -- they may lead to error
    //
    if (dt > 200) {
        console.log("Big dt =", dt, ": CLAMPING TO NOMINAL");
        dt = NOMINAL_UPDATE_INTERVAL;
    }

    // If using variable time, divide the actual delta by the "nominal" rate,
    // giving us a conveniently scaled "du" to work with.
    //
    var du = (dt / NOMINAL_UPDATE_INTERVAL);

    updateSimulation(du);

    g_prevUpdateDt = original_dt;
    g_prevUpdateDu = du;

    g_isUpdateOdd = !g_isUpdateOdd;

}

// Togglable Pause Mode
//
var KEY_PAUSE = 13;
var KEY_STEP  = 'N'.charCodeAt(0);

var g_isUpdatePaused = true;

function shouldSkipUpdate() {
    if (eatKey(KEY_PAUSE)) {
        g_isUpdatePaused = !g_isUpdatePaused;
        canvas.height = 0;
        winCanvas.height = 0;
        intervals()
        console.log("start");
        if(hasFinesed){
          console.log("halú");
          location.reload();
        }
    }
    return g_isUpdatePaused && !eatKey(KEY_STEP);
;
}

var spawnWeapon = true;

var spawnHealth = true;

function intervals(){
  window.setInterval(function(){
      if (spawnHealth){
        var Ypos = [500, 228];
        createInitialPickups(800, Ypos[Math.round(Math.random())]);
        spawnHealth = false;
      }
  }, 20000);

  window.setInterval(function(){
    if (spawnWeapon){
      var Xpos = [600, 800, 1000];
      var Ypos = [50, 160, 300, 400, 700];
      var type = [g_sprites.shotgun, g_sprites.rocketLauncher, g_sprites.uzi];
      createInitialPickups(Xpos[Math.floor(Math.random() * 2)], Ypos[Math.floor(Math.random() * 4)], type[Math.floor(Math.random() * 3)]);
      spawnWeapon = false;
    }
  }, 10000);

}
