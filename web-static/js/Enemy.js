var Enemy = function(assetManager, level){
	var _this = this;
	Character.call(this);
   
	this.centerX = 26;
	this.centerY = 26;
   
	/* Enemy sprite */
	this.createSprite("attack", assetManager.getImage("goblin"), null, 208, 468, 3, 0, 4, 9, false);
	this.createSprite("move", assetManager.getImage("goblin"), null, 208, 468, 4, 1, 4, 9, false);
	this.createSprite("idle", assetManager.getImage("goblin"), null, 208, 468, 2, 2, 4, 9, true);
	this.createSprite("attack-up", assetManager.getImage("goblin"), null, 208, 468, 3, 3, 4, 9, false);
	this.createSprite("move-up", assetManager.getImage("goblin"), null, 208, 468, 4, 4, 4, 9, false);
	this.createSprite("idle-up", assetManager.getImage("goblin"), null, 208, 468, 2, 5, 4, 9, true);
	this.createSprite("attack-down", assetManager.getImage("goblin"), null, 208, 468, 3, 6, 4, 9, false);
	this.createSprite("move-down", assetManager.getImage("goblin"), null, 208, 468, 4, 7, 4, 9, false);
	this.createSprite("idle-down", assetManager.getImage("goblin"), null, 208, 468, 2, 8, 4, 9, true);
 
	for(var i in this.spriteList){
		this.spriteList[i].setCenter(this.centerX, this.centerY);
	}
 
	this.setSprite("idle-down");
	this.setPosition(Enemy.MIN_X + Math.random() * (Enemy.MAX_X - Enemy.MIN_X), Enemy.MIN_Y + Math.random() * (Enemy.MAX_Y - Enemy.MIN_Y));
 
	var finalScale = this.scale;
	$.ease(0, 1, function(v){
		_this.setScale(v * finalScale);
	}, 1000);
   
	this.revertDirection = false;
	this.level = level;
	this.gold = parseInt(Math.random() * 200);
	
	this.HealthMax = 20 + 10 * this.level;
	this.Health = this.HealthMax;
	this.isDead = false;
	
	this.range = 100;
	this.experienceGain = 500;
};
Enemy.MIN_Y = 1550;
Enemy.MAX_Y = 1920;
Enemy.MIN_X = 2400;
Enemy.MAX_X = 4000;
Enemy.MIN_SCALE = 0.3;
Enemy.MAX_SCALE = 0.8;
 
Enemy.prototype = new Character();
Enemy.prototype.setPosition = function(x, y){
	var lastY = this.y;
	Character.prototype.setPosition.call(this, x, y);
   
	if(this.y != lastY){
		var factor = (y - Enemy.MIN_Y) / (Enemy.MAX_Y - Enemy.MIN_Y);
		this.setScale(factor * (Enemy.MAX_SCALE - Enemy.MIN_SCALE) + Enemy.MIN_SCALE);
	}
};

Enemy.prototype.render = function(g){
	g.save();
	g.translate(this.x-this.centerX, this.y-this.centerY - 5);
	g.fillStyle = "red";
	g.font = "bold 12px Arial";
	g.fillText("Goblin lvl " + this.level,0,0);
	g.fillRect(0, 5, 52, 5);
	g.fillStyle = "green";
	g.fillRect(0, 5, 52 * parseFloat(this.Health/this.HealthMax), 5);
	g.restore();
	Character.prototype.render.call(this, g);
}
 
Enemy.prototype.Death = function(other) {
	other.gold = other.gold + this.gold;
	other.GiveXP(this.experienceGain);
	this.isDead = true;
}
 
Enemy.prototype.sufferDamagesBy = function(damage, player){
	//this.sufferDamages(damage);
	this.sufferDamages(damage);
	if(this.Health <= 0) {
		this.Death(player);
	}
}
 
Enemy.prototype.setScale = function(scale){
	this.scale = scale;
	for(var i in this.spriteList){
		this.spriteList[i].setScale(this.scale);
	}
};