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


function update(dt) {
<<<<<<< HEAD

=======
    
>>>>>>> 9610ffdeea4575efc734d0801ce3fa34d2433f96
    // Get out if skipping (e.g. due to pause-mode)
    //
    if (shouldSkipUpdate()) return;

    // Remember this for later
    //
    var original_dt = dt;
<<<<<<< HEAD

=======
    
>>>>>>> 9610ffdeea4575efc734d0801ce3fa34d2433f96
    // Warn about very large dt values -- they may lead to error
    //
    if (dt > 200) {
        console.log("Big dt =", dt, ": CLAMPING TO NOMINAL");
        dt = NOMINAL_UPDATE_INTERVAL;
    }
<<<<<<< HEAD

=======
    
>>>>>>> 9610ffdeea4575efc734d0801ce3fa34d2433f96
    // If using variable time, divide the actual delta by the "nominal" rate,
    // giving us a conveniently scaled "du" to work with.
    //
    var du = (dt / NOMINAL_UPDATE_INTERVAL);
<<<<<<< HEAD

    updateSimulation(du);

    g_prevUpdateDt = original_dt;
    g_prevUpdateDu = du;

=======
    
    updateSimulation(du);
    
    g_prevUpdateDt = original_dt;
    g_prevUpdateDu = du;
    
>>>>>>> 9610ffdeea4575efc734d0801ce3fa34d2433f96
    g_isUpdateOdd = !g_isUpdateOdd;
}

// Togglable Pause Mode
//
var KEY_PAUSE = 'P'.charCodeAt(0);
<<<<<<< HEAD
//var KEY_STEP  = 'O'.charCodeAt(0);
=======
var KEY_STEP  = 'O'.charCodeAt(0);
>>>>>>> 9610ffdeea4575efc734d0801ce3fa34d2433f96

var g_isUpdatePaused = false;

function shouldSkipUpdate() {
    if (eatKey(KEY_PAUSE)) {
        g_isUpdatePaused = !g_isUpdatePaused;
    }
<<<<<<< HEAD
    return g_isUpdatePaused && !eatKey(KEY_STEP);
}
=======
    return g_isUpdatePaused && !eatKey(KEY_STEP);    
}
>>>>>>> 9610ffdeea4575efc734d0801ce3fa34d2433f96
