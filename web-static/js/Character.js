var Character = function(){

    this.revertDirection = false;

	this.spriteList = {};
	this.currentSprite = false;
	
	this.positionListenerList = [];
	
	this.HealthMax = 100;
	this.Health = this.HealthMax;

	this.gold = 0;
};

Character.prototype.addPositionListener = function(listener){
	this.positionListenerList.push(listener);
};

Character.prototype.setSprite = function(anim, onComplete){
	this.lastAnimId = anim;
	var spriteId = anim;
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

Character.prototype.sufferDamages = function(damage){
	this.Health = this.Health - parseInt(damage);
}

Character.prototype.render = function(g){
	if(this.currentSprite) {
		g.save();
		g.translate(this.x, this.y);
		this.currentSprite.render(g, this.revertDirection);
		g.restore();
	}
}

Character.prototype.FireEvent = function(){
	for (var i in this.positionListenerList){
		this.positionListenerList[i](this.x, this.y);
	}
}

Character.prototype.setPosition = function(x, y){
	this.x = parseInt(x);
	this.y = parseInt(y);
	
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
Character.prototype.createSprite = function(id, url, url2, width, height, colCount, rowCount, colHeight, rowHeight, loop) {
	this.spriteList[id] = new Sprite(id, url, url2, width, height, colCount, rowCount, colHeight, rowHeight, loop);
};