var winCanvas = document.getElementById('winCanvas');
var winContext = winCanvas.getContext('2d');

winContext.font = "50px Impact";
winContext.fillStyle = "red";
winContext.textAlign = "center";
function wictory(winer){
  winCanvas.width = 1601;
  winCanvas.height = 801;
  winContext.font = "50px Impact";
  winContext.fillText("The winner is: "+ winer, 1600/2,800/2);
  setTimeout(function () {  
      location.reload();

    }, 5000);
}
