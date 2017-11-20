// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// Construct a "sprite" from the given `image`,
//
function Sprite(image) {
    this.image = image;

    this.width = image.width;
    this.height = image.height;
    this.scale = 1;
}

Sprite.prototype.drawAt = function (ctx, x, y) {
    ctx.drawImage(this.image,
                  x, y);
};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;

    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);

    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    try{
      ctx.drawImage(this.image,
                    -w/2, -h/2);

    }
    catch(err) {
    console.log(err);
}


    ctx.restore();
};

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation) {

    // Get "screen width"
    var sw = g_canvas.width;

    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, rotation);


};
Sprite.prototype.drawFrameAt = function (ctx,cx,cy,rotation,row,colum) {
  if (rotation === undefined) rotation = 0;
  if (row === undefined) row = 1;
  if (colum === undefined) colum = 0;

  var w = this.width,
      h = this.height;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  var frameWidth = this.width/5;
  var frameHeigth = this.height/1.5;
  var walkingmod = colum%4;//123

  //this draws the mid off the sprite sheet wher the animasion is hapening 
  try{
    ctx.drawImage(this.image,walkingmod*frameWidth,frameHeigth*0.5,frameWidth,
      frameHeigth/2,-w/8, -h/6,frameWidth,frameHeigth*0.5);

  }
  catch(err) {
  console.log(err);
}


  ctx.restore();
};
Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, rotation) {

    // Get "screen height"
    var sh = g_canvas.height;

    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, rotation);


};
