var Scale ={
  Camera: function(ctx,player1,player2){
    var p1 = player1.getPos();
    var p2 = player2.getPos();
    //wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap)
    //check corner cases
    var d1 = util.wrappedDistSq(p1.posX, p1.posY, 0, 0,g_canvas.width, g_canvas.height);
    var d2 = util.wrappedDistSq(p2.posX, p2.posY, 0, 0,g_canvas.width, g_canvas.height);
    //check midle y and x :0 : width
    var d3 = util.wrappedDistSq(p1.posX, p1.posY, 0, g_canvas.height/2,g_canvas.width, g_canvas.height);
    var d4 = util.wrappedDistSq(p2.posX, p2.posY, 0, g_canvas.height/2,g_canvas.width, g_canvas.height);
    //x: width/4 and y : 0 : height
    var d5 = util.wrappedDistSq(p1.posX, p1.posY, g_canvas.width/4, 0,g_canvas.width, g_canvas.height);
    var d6 = util.wrappedDistSq(p2.posX, p2.posY, g_canvas.width/4, 0,g_canvas.width, g_canvas.height);
    //x: width/2 and y : 0 : height
    var d7 = util.wrappedDistSq(p1.posX, p1.posY, g_canvas.width/2, 0,g_canvas.width, g_canvas.height);
    var d8 = util.wrappedDistSq(p2.posX, p2.posY, g_canvas.width/2, 0,g_canvas.width, g_canvas.height);
    //x: (width/4)*3 and y : 0 : height
    var d9 = util.wrappedDistSq(p1.posX, p1.posY, 3*g_canvas.width/4, 0,g_canvas.width, g_canvas.height);
    var d10 = util.wrappedDistSq(p2.posX, p2.posY, 3*g_canvas.width/4, 0,g_canvas.width, g_canvas.height);

    // the closest distans to point
    var d = Math.min(d1,d2,d3,d4,d5,d6,d7,d8,d9,d10);

    return 1+(d/g_canvas.width)/160;
  },
  Point: function(player1,player2){
    var pos1 = player1.getPos();
    var pos2 = player2.getPos();
    return {
      x : Math.abs(((pos1.posX + pos2.posX) / 2)-200),
      y : Math.abs(((pos1.posY + pos2.posY) / 2)-100)
    }
  }

}
