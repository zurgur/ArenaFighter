function Pickup(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}
//global power upp
Pickup.prototype = new Entity();

Pickup.prototype = "Pickup";
//render power_ups
Power.prototype.render = function(ctx){
  for(var i = 0; i<this.power_ups.length;i++){
    var rot = Math.PI / 2 * 3;
    var x = this.power_ups[i][0];
    var y = this.power_ups[i][1];
    var step = Math.PI / 5;

    ctx.strokeSyle = "black";
    ctx.beginPath();
    ctx.moveTo(this.power_ups[i][0], this.power_ups[i][1] - 10)
    for (j = 0; j < 5; j++) {
        x = this.power_ups[i][0] + Math.cos(rot) * 10;
        y = this.power_ups[i][1] + Math.sin(rot) * 10;
        ctx.lineTo(x, y)
        rot += step

        x = this.power_ups[i][0] + Math.cos(rot) * 5;
        y = this.power_ups[i][1] + Math.sin(rot) * 5;
        ctx.lineTo(x, y)
        rot += step
    }
    ctx.lineTo(this.power_ups[i][0], this.power_ups[i][1] - 10)
    ctx.closePath();
    ctx.lineWidth=5;
    //if make paddle big gold star
    if(this.power_ups[i][2] === 1){
      ctx.strokeStyle='orange';
      ctx.fillStyle='Gold';
    }else {
      //if lazer red star
      ctx.strokeStyle='orange';
      ctx.fillStyle='red';
    }

    ctx.stroke();
    ctx.fill();
}
};
//update  power ups
Power.prototype.update = function(du){
  for(var i = 0; i<this.power_ups.length;i++){
    this.power_ups[i][1] += this.dropRate * du;

    if(g_paddle1.collidesWith(this.power_ups[i][0],this.power_ups[i][1],5)){
      if(this.power_ups[i][2] === 1){
        g_paddle1.halfWidth += 3;
      }else{
        g_lazer.isOn = true;
      }
      this.power_ups.splice(i,1);
    }else if(this.power_ups[i][1]-5>=g_canvas.height){
      this.power_ups.splice(i,1);
    }
  }
};
