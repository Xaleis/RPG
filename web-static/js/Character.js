var Character = function(){

    this.revertDirection = false;

	this.spriteList = {};
	this.currentSprite = false;
	
	this.positionListenerList = [];
	
	this.name = "";
	this.level = 1;
	this.exp = 0;
	this.gold = 0;
	this.inventory = [];
};

Character.prototype.addPositionListener = function(listener){
	this.positionListenerList.push(listener);
};

Character.prototype.setSprite = function(anim, onComplete){
	this.lastAnimId = anim;
	var spriteId = anim + "-" + (this.revertDirection?"left":"right");
	//console.log("new anim " + spriteId);
	/*if(this.currentSprite != this.spriteList[spriteId]){
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
	}*/
};

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