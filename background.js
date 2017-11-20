function Background(image) {
  this.image = image;

  this.width = image.width;
  this.height = image.height;
  this.scale = 1;
  this.speed = 1;
  this.totalSeconds = 0;
}

Background.prototype.drawAt = function (ctx, x, y) {
    ctx.drawImage(this.image,
                  x, y);
};

Background.prototype.drawBackrond = function (ctx,du) {


 this.totalSeconds += du;
 var vx = 100; // the background scrolls with a speed of 100 pixels/sec
 var numImages = Math.ceil(g_canvas.width / this.width) + 1;
 var xpos = this.totalSeconds * this.speed % this.width;
 ctx.save();
 ctx.translate(-xpos, 0);
 ctx.rect(20,20,150,100);
 for (var i = 0; i < numImages; i++) {
     ctx.drawImage(this.image, i * this.width, 0);
 }
 ctx.restore();
};
