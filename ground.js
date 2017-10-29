function Ground(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}
//global wall has a arry that stores the  wall states
var g_ground = new Ground({
  brickOffsetTop : 530,
  brickOffsetLeft : 0,
  brickWidth : 10,
  brickHeight : 10,
  brickPadding : 0,
  bricks : [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
            ,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
            ,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
            ,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
            ,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ]
});

var brickRows = g_ground.bricks.length;
var bricksPerRow = g_ground.bricks[0].length;
//draw the bricks
Ground.prototype.drawBricks = function(ctx){
  for(c=0; c<brickRows; c++) {
      for(r=0; r<this.bricks[c].length; r++) {
          var brickX = (c*(this.brickWidth+this.brickPadding))+this.brickOffsetTop;
          var brickY = (r*(this.brickHeight+this.brickPadding))+this.brickOffsetLeft;
          if(this.bricks[c][r]>0){
              ctx.beginPath();
              ctx.rect(brickY, brickX, this.brickWidth, this.brickHeight);
              ctx.fillStyle = "blue";
              ctx.fill();
              ctx.closePath();
            }
          }
      }
  }

Ground.prototype.collidesWith = function(posX,posY,r){
  var hit = "";
  //get the x and y as it was in the arry
  var brickY = Math.floor((posY - this.brickOffsetTop) / this.brickHeight);
  var brickX = Math.floor((posX - this.brickOffsetLeft) / this.brickWidth);
  //check if the ball hits a brick
  if (bricksPerRow>brickX  &&  0<=brickX){
    if(brickRows>brickY && 0<=brickY){
      //is there still a brick there
      if(this.bricks[brickY][brickX] > 0){
        //is there a posiblity to hit the side
        if(!this.bricks[brickY][brickX+1]||!this.bricks[brickY][brickX-1]||
          this.bricks[brickY][brickX+1]===0||this.bricks[brickY][brickX-1]===0){
            var top = this.brickOffsetTop + this.brickHeight * brickY;
            var botom = this.brickOffsetTop + this.brickHeight * (brickY + 1);
            if(posY>top && posY<botom){
              return true;
            }
          }else{
            return true;
          }
        return hit;
      }

    }
  }
}
