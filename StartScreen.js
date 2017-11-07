var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

context.font = "50px Impact";
context.fillStyle = "red";
context.textAlign = "center";
context.fillText("Areana Figther", canvas.width/2,canvas.height/2);
context.font = "20px Impact";
context.fillText("Press Enter to strart", canvas.width/2,canvas.height/2+30);

var soundtrack = new Audio('sounds/Pixel Fags.mp3');
/*soundtrack.addEventListener('ended', function() {
  if(g_playMusic){
    this.currentTime = 0;
    this.play();
  }
}, false);*/
//soundtrack.play();
