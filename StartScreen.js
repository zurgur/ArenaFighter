//get canvas global stuff
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
//global soundtrack
var soundtrack = new Audio('sounds/Pixel Fags.mp3');
//volume of global soundtrack
soundtrack.volume = 0.4;
//paly the soundtrack in a loop
soundtrack.play()
setInterval(function() { soundtrack.play(); }, 248000);
