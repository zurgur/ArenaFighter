var Scale ={
  Camera: function(ctx,player1,player2){
    var pos1 = player1.getPos();
    var pos2 = player2.getPos();
    return 1+(g_canvas.width/util.distSq(pos1.posX,pos1.posY,pos2.posX,pos2.posY))*10;
  },
  Point: function(player1,player2){
    var pos1 = player1.getPos();
    var pos2 = player2.getPos();
    return {
      x : Math.abs(((pos1.posX + pos2.posX) / 2)),
      y : Math.abs(((pos1.posY + pos2.posY) / 2))
    }
  }

}
