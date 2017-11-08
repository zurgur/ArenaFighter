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

  //draw a box to fill the top of the image
  ctx.beginPath();
  ctx.rect(0, 0, 1600, 301);
  ctx.fillStyle = "#8FD0B1";
  ctx.fill();

 this.totalSeconds += du;
 var vx = 100; // the background scrolls with a speed of 100 pixels/sec
 var numImages = Math.ceil(g_canvas.width / this.width) + 1;
 var xpos = this.totalSeconds * this.speed % this.width;
 //console.log(xpos,numImages);
 ctx.save();
 ctx.translate(-xpos, 0);
 ctx.rect(20,20,150,100);
 for (var i = 0; i < numImages; i++) {
     ctx.drawImage(this.image, i * this.width, 300);
 }
 ctx.restore();
};
