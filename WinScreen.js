//global winCanvas stuff
var winCanvas = document.getElementById('winCanvas');
var winContext = winCanvas.getContext('2d');
//just add the insturction canvas glabals
var instruct = document.getElementById('instructions');
var instructCTX = instruct.getContext('2d');

//funtion tha takes in winer variable
//and prints out the winner is "winer"
function wictory(winer){
  winCanvas.width = 1601;
  winCanvas.height = 801;
  winContext.font = "50px Impact";
  winContext.fillStyle = "red";
  winContext.textAlign = "center";
  winContext.font = "50px Impact";
  winContext.fillText("The winner is: "+ winer, 1600/2,800/2);
  //reload the game after set time
  setTimeout(function () {
      location.reload();

    }, 5000);
}
