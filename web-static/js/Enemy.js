var Enemy = function(assetManager){
	var _this = this;
	Character.call(this);
   
	this.centerX = 26;
	this.centerY = 26;
   
	/*this.createSprite("death", assetManager.getImage("goblin"), 208, 468, 14, 1, false);*/
	this.createSprite("attack", assetManager.getImage("mob"), 208, 468, 3, 0, 9, false);
	this.createSprite("move", assetManager.getImage("mob"), 208, 468, 4, 1, 9, false);
	this.createSprite("idle", assetManager.getImage("mob"), 208, 468, 2, 2, 9, true);
	this.createSprite("attack-up", assetManager.getImage("mob"), 208, 468, 3, 3, 9, false);
	this.createSprite("move-up", assetManager.getImage("mob"), 208, 468, 4, 4, 9, false);
	this.createSprite("idle-up", assetManager.getImage("mob"), 208, 468, 2, 5, 9, true);
	this.createSprite("attack-down", assetManager.getImage("mob"), 208, 468, 3, 6, 9, false);
	this.createSprite("move-down", assetManager.getImage("mob"), 208, 468, 4, 7, 9, false);
	this.createSprite("idle-down", assetManager.getImage("mob"), 208, 468, 2, 8, 9, true);
 
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
	this.gold = Math.random() * 200;
	
	this.HealthMax = 50;
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
	g.translate(this.x, this.y);
	g.fillStyle = "red";
	g.fillRect(0, 0, 52, 5);
	g.fillStyle = "green";
	g.fillRect(0, 0, 52 * parseInt(this.Health/this.HealthMax), 5);
	g.restore();
	Character.prototype.render.call(this, g);
}
 
Enemy.prototype.Death = function(other) {
	other.gold = other.gold + this.gold;
	other.GiveXP(this.experienceGain);
	this.isDead = true;
}
 
Enemy.prototype.sufferDamages = function(damage, player){
	//this.sufferDamages(damage);
	Character.prototype.sufferDamages.call(this, damage);
	if(this.health < 0) {
		this.Death(player);
	}
}
 
Enemy.prototype.setScale = function(scale){
	this.scale = scale;
	for(var i in this.spriteList){
		this.spriteList[i].setScale(this.scale);
	}
};