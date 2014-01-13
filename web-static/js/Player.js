var Player = function(assetManager){
	var self = this;
	Character.call(this);
	
	$(document).keyup(function(e){
		self.onKeyUp(e);
	});
	$(document).keydown(function(e){
		self.onKeyDown(e);
	});
		
	this.speed = {
		x: 600,
		y: 200
	};
	
	//this.spriteName = "/RPG-static/img/sprite/clotharmor.png";
    //this.weaponName = "/RPG-static/img/sprite/sword1.png";
	
	this.Level = 1; // Current level
	this.XP = 0; // Total amount of gathered XP
	this.XPGatheredForNextLevel = 0; // Amount of XP gathered for the next level
	this.XPRequiredForNextLevel = 0; // Amount of XP required for the next level
	this.experience = 0;

	this.centerX = 32;
	this.centerY = 32;

	/* Player */
	this.createSprite("attack",assetManager.getImage("player"), 320, 576, 5, 0, 9, false);
	this.createSprite("move",assetManager.getImage("player"), 320, 576, 4, 1, 9, true);
	this.createSprite("idle",assetManager.getImage("player"), 320, 576, 2, 2, 9, true);
	this.createSprite("attack-up",assetManager.getImage("player"), 320, 576, 5, 3, 9, false);
	this.createSprite("move-up",assetManager.getImage("player"), 320, 576, 4, 4, 9, true);
	this.createSprite("idle-up",assetManager.getImage("player"), 320, 576, 2, 5, 9, true);
	this.createSprite("attack-down",assetManager.getImage("player"), 320, 576, 5, 6, 9, false);
	this.createSprite("move-down",assetManager.getImage("player"), 320, 576, 4, 7, 9, true);
	this.createSprite("idle-down",assetManager.getImage("player"), 320, 576, 2, 8, 9, true);
	
	/* Player equipment */
	this.createSprite("sword-attack",assetManager.getImage("sword"), 320, 576, 5, 0, 9, false);
	this.createSprite("sword-move",assetManager.getImage("sword"), 320, 576, 4, 1, 9, true);
	this.createSprite("sword-idle",assetManager.getImage("sword"), 320, 576, 2, 2, 9, true);
	this.createSprite("sword-attack-up",assetManager.getImage("sword"), 320, 576, 5, 3, 9, false);
	this.createSprite("sword-move-up",assetManager.getImage("sword"), 320, 576, 4, 4, 9, true);
	this.createSprite("sword-idle-up",assetManager.getImage("sword"), 320, 576, 2, 5, 9, true);
	this.createSprite("sword-attack-down",assetManager.getImage("sword"), 320, 576, 5, 6, 9, false);
	this.createSprite("sword-move-down",assetManager.getImage("sword"), 320, 576, 4, 7, 9, true);
	this.createSprite("sword-idle-down",assetManager.getImage("sword"), 320, 576, 2, 8, 9, true);
   
	for(var i in this.spriteList) {
		this.spriteList[i].setCenter(this.centerX, this.centerY);
	}
	
	this.keyList = {};
    this.revertDirection = false;
	this.lookAt = "down";
    this.setSprite("idle-down");
};
Player.MAX_LEVEL = 50; // Level max
Player.XP_INCREMENT = 500; // Amount of XP that is added to the amount of XP required for a level, after each level progression

Player.MIN_Y = 1455;
Player.MAX_Y = 1920;
Player.MIN_SCALE = 0.5;
Player.MAX_SCALE = 1.3;

Player.prototype = new Character();
Player.prototype.init = function(){
};
Player.prototype.setPosition = function(x, y){
	var lastY = this.y;
	Character.prototype.setPosition.call(this, x, y);
	
	if(this.y != lastY){
		var factor = (y - Player.MIN_Y) / (Player.MAX_Y - Player.MIN_Y);
		this.setScale(factor * (Player.MAX_SCALE - Player.MIN_SCALE) + Player.MIN_SCALE);
	}
};

Player.prototype.setScale = function(scale){
        this.scale = scale;
        for(var i in this.spriteList){
                this.spriteList[i].setScale(this.scale);
        }
};

Player.prototype.render = function(g){
	g.save();
	g.fillStyle = "white";
	g.fillRect(10, 10, 100, 20);
	g.fillStyle = "yellow";
	g.fillRect(10, 10, 100 * parseInt(this.experience/100), 20);
	g.restore();
	Character.prototype.render.call(this, g);
}

Player.prototype.update = function(deltaTime){
	var move = {x: 0, y: 0};
	
	//console.log(this.keyList);
	// Q (113|81)

	// S (115|83)

	// D (100|68)

	// Z (122|90)
	for(var i in this.keyList) {
		if(this.keyList[i]) {
			switch(i) {
				case "113", "81":
					this.revertDirection = true;
					move.x = -1;
					this.lookAt = "left";
				break;
				case "115", "83":
					this.revertDirection = false;
					move.y = 1;
					this.lookAt = "down";
				break;
				case "100", "68":
					this.revertDirection = false;
					move.x = 1;
					this.lookAt = "right";
				break;
				case "122", "90":
					this.revertDirection = false;
					move.y = -1;
					this.lookAt = "up";
				break;
			}
		}
	}
	if(move.x != 0 || move.y != 0){
		this.move(move.x * this.speed.x /* this.scale*/ * deltaTime, move.y * this.speed.y /* this.scale*/ * deltaTime);
		switch(this.lookAt){
			case "up":
				this.setSprite("move-up");
				//this.setSprite("sword-move-up");
			break;
			case "left", "right":
				this.setSprite("move");
				//this.setSprite("sword-move");
			break;
			case "down":
				this.setSprite("move-down");
				//this.setSprite("sword-move-down");
			break;
		}
	}else{
		switch(this.lookAt){
			case "up":
				this.setSprite("idle-up");
				//this.setSprite("sword-idle-up");
			break;
			case "left", "right":
				this.setSprite("idle");
				//this.setSprite("sword-idle");
			break;
			case "down":
				this.setSprite("idle-down");
				//this.setSprite("sword-idle-down");
			break;
		}
	}
	//this.setSprite (move, idle);
};

Player.prototype.onKeyDown = function(k){
	var self = this;
	var fonction = function(){
		self.setSprite(lastAnim);
		for (var i in game.mobList) {
            if(self.x - 40 <  game.mobList[i].x && game.mobList[i].x < self.x + 40) {
                if(self.y - 50 < game.mobList[i].y && game.mobList[i].y < self.y + 50) {
                    camera.shake(3);
					// inflige 25 pts de degats à l'ennemi
                    game.mobList[i].sufferDamages(25, self);
					if(game.mobList[i].isDead){
						setTimeout(function() {
							game.mobList.splice(i, 1);
						}, 2000);
					}
                }
			}
		}
	}
	if(k.which == 32) {
		var lastAnim = this.lastAnimId;
		switch(this.lookAt){
			case "up":
				this.setSprite("attack-up", fonction);
				//this.setSprite("sword-attack-up");
			break;
			case "left", "right":
				this.setSprite("attack", fonction);
				//this.setSprite("sword-attack");
			break;
			case "down":
				this.setSprite("attack-down", fonction);
				//this.setSprite("sword-attack-down");
			break;
		}
	}
	this.keyList[k.which] = true;
};
Player.prototype.onKeyUp = function(k){
	this.keyList[k.which] = false;
};

Player.prototype.LevelUp = function(){
    this.Level++;

    this.Health = this.HealthMax;
};

Player.prototype.sufferDamages = function(damage){
	Character.prototype.sufferDamages.call(this, damage);
	if(this.health < 0) {
		this.DeadPlayer();
	}
}

Player.prototype.DeadPlayer = function()
{
    this.XP = this.XP - (this.Level * 100);
    if(this.Level == 1 && this.XP < 0)
    {
        this.XP = 0;
    }
    this.CalculateLevelProgress();
    if(this.XPGatheredForNextLevel < 0)
    {
        this.Level--;
        
        this.CalculateLevelProgress();
    }
};

Player.prototype.GiveXP = function(amount)
{
    this.XP += amount;

    this.CalculateLevelProgress();

    while (this.XPGatheredForNextLevel >= this.XPRequiredForNextLevel && this.Level < Player.MAX_LEVEL)
    {
        this.LevelUp();

        // Recalculate level progress after leveling up
        this.CalculateLevelProgress();
    }
};

Player.prototype.CalculateLevelProgress = function()
{
    var XPToCurrentLevel; // Total amount of XP gathered with current and previous levels
    var tmp;
    
    tmp = this.Level-1;
    
    while(tmp != 0)
    {
        XPToCurrentLevel += tmp * Player.XP_INCREMENT * Math.sqrt(tmp);
        tmp--;
    }
    
    this.XPRequiredForNextLevel = this.Level * Player.XP_INCREMENT * Math.sqrt(this.Level);
    
    if(this.Level == Player.MAX_LEVEL && this.XPGatheredForNextLevel > this.XPRequiredForNextLevel)
    {
        this.XP = this.XPRequiredForNextLevel + XPToCurrentLevel;
    }
    
    this.XPGatheredForNextLevel = this.XP - XPToCurrentLevel;
    
    this.experience = (parseFloat(this.XPGatheredForNextLevel) * 100) / parseFloat(this.XPRequiredForNextLevel);
};