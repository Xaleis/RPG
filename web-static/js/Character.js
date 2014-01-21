var Character = function(){

    this.revertDirection = false;

	this.spriteList = {};
	this.currentSprite = false;
	
	this.positionListenerList = [];
	
	this.HealthMax = 100;
	this.Health = this.HealthMax;
<<<<<<< HEAD

=======
<<<<<<< HEAD
	
=======
>>>>>>> f44e8c7b8e87d0d8e41a924507f677c054a0771b
>>>>>>> 2a26c7b95392ffea9c0bd487c4f4b3c200bf9b52
	this.gold = 0;
};

Character.prototype.addPositionListener = function(listener){
	this.positionListenerList.push(listener);
};

Character.prototype.setSprite = function(anim, onComplete){
	this.lastAnimId = anim;
	var spriteId = anim;
	//console.log("new anim " + spriteId);
	if(this.currentSprite != this.spriteList[spriteId]){
		if(!this.currentSprite || this.currentSprite.loop || this.currentSprite.currentFrame == this.currentSprite.frameCount - 1){
			if(this.currentSprite){
				this.currentSprite.stop();
				this.currentSprite.hide();
			}
			this.currentSprite = this.spriteList[spriteId];
			this.currentSprite.resetAnim();
			this.currentSprite.play(onComplete);
			this.currentSprite.show();
        }else{
            this.nextSprite = anim;
        }
	}
};

<<<<<<< HEAD
Character.prototype.sufferDamages = function(damage){
	this.Health = this.Health - parseInt(damage);
}

=======
>>>>>>> f44e8c7b8e87d0d8e41a924507f677c054a0771b
Character.prototype.render = function(g){
	if(this.currentSprite) {
		g.save();
		g.translate(this.x, this.y);
		this.currentSprite.render(g, this.revertDirection);
		//g.translate(-this.x, -this.y);
		g.restore();
	}
<<<<<<< HEAD
=======
	g.save();
	g.translate(10, 10);
	g.fillStyle = "red";
<<<<<<< HEAD
	g.fillRect(10, 10, 100, 20);
	g.fillStyle = "green";
	g.fillRect(10, 10, 100 * parseInt(this.Health/this.HealthMax), 20);
	//g.drawImage("", 0, 0);
=======
	g.fillRect(0, 0, 100, 20);
	g.drawImage("", 0, 0);
>>>>>>> f44e8c7b8e87d0d8e41a924507f677c054a0771b
	g.font = "20px Arial";
	g.fillText("Player",0,0);
	g.restore();
>>>>>>> 2a26c7b95392ffea9c0bd487c4f4b3c200bf9b52
}

Character.prototype.FireEvent = function(){
	for (var i in this.positionListenerList){
		this.positionListenerList[i](this.x, this.y);
	}
}

Character.prototype.setPosition = function(x, y){
	this.x = parseInt(x);
	this.y = parseInt(y);
	//this.$elm.css({top: this.y + "px", left: this.x + "px"});
	
	this.FireEvent();
};
Character.prototype.moveTo = function(x, y){
	var self = this;
	if(this.animHandler){
		this.animHandler.stop(false, false);
	}
	this.animHandler = $.ease({
		x: this.x,
		y: this.y
	}, {
		x: x, 
		y: y
	}, function(o){
		self.setPosition(o.x, o.y);
	},
	{
		easing: "easeOutCirc",
		duration: 300
	});
};
Character.prototype.move = function(x, y){
	this.moveTo(this.x + x, this.y + y);
};
<<<<<<< HEAD
Character.prototype.createSprite = function(id, url, url2, width, height, colCount, rowCount, colHeight, rowHeight, loop) {
	this.spriteList[id] = new Sprite(id, url, url2, width, height, colCount, rowCount, colHeight, rowHeight, loop);
=======
<<<<<<< HEAD
Character.prototype.createSprite = function(id, url, width, height, colCount, rowCount, rowHeight, loop) {
	this.spriteList[id] = new Sprite(id, url, width, height, colCount, rowCount, rowHeight, loop);
=======

Character.prototype.createSprite = function(id, url, width, height, colCount, rowCount, loop) {
	this.spriteList[id] = new Sprite(id, url, width, height, colCount, rowCount, loop);
>>>>>>> f44e8c7b8e87d0d8e41a924507f677c054a0771b
>>>>>>> 2a26c7b95392ffea9c0bd487c4f4b3c200bf9b52
};