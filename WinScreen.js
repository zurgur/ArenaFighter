

//funtion tha takes in winer variable
//and prints out the winner is "winer"
function wictory(winer){
  hasFinesed = true;
  winCanvas.width = 1601;
  winCanvas.height = 801;
  winContext.font = "50px Impact";
  winContext.fillStyle = "red";
  winContext.textAlign = "center";
  winContext.font = "50px Impact";
  winContext.fillText("The winner is: "+ winer, 1600/2,800/2);
  winContext.fillText("press Enter to play agin",1600/2,800/2+100);

}
