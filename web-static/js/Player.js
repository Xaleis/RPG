var Player = function(){
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
	
	this.spriteName = "clotharmor";
    this.weaponName = "sword1";
	
	this.Level = 1; // Current level
	this.XP = 0; // Total amount of gathered XP
	this.XPGatheredForNextLevel = 0; // Amount of XP gathered for the next level
	this.XPRequiredForNextLevel = 0; // Amount of XP required for the next level
	this.experience = 0;
	
	this.centerX = 32;
	this.centerY = 32;
	
	this.createSprite("idle",assetManager.getImage("player-idle"), 2048, 256, 16, 2, true);
	this.createSprite("attack",assetManager.getImage("player-attack"), 2048, 128, 16, 1, false);
	this.createSprite("move",assetManager.getImage("player-move"), 896, 128, 7, 1, true);
	
	for(var i in this.spriteList) {
		this.spriteList[i].setCenter(this.centerX, this.centerY);
	}
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
					//this.direction = "west";
				break;
				case "115", "83":
					this.revertDirection = false;
					move.y = 1;
					//this.direction = "south";
				break;
				case "100", "68":
					this.revertDirection = false;
					move.x = 1;
					//this.direction = "est";
				break;
				case "122", "90":
					this.revertDirection = false;
					move.y = -1;
					//this.direction = "north";
				break;
			}
		}
	}
	if(move.x != 0 || move.y != 0){
		this.move(move.x * this.speed.x * this.scale * deltaTime, move.y * this.speed.y * this.scale * deltaTime);
		this.setSprite("move");
	}else{
		this.setSprite("idle");
	}

	//this.setSprite (move, idle);
};

Player.prototype.onKeyDown = function(k){
	var self = this;
	if(k.which == 32) {
		var lastAnim = this.lastAnimId;
		this.setSprite("attack", function(){
			self.setSprite(lastAnim);
			camera.shake(3);
		});
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
        XPToCurrentLevel += tmp * Player.XP_INCREMENT * sqrt(tmp);
        tmp--;
    }
    
    this.XPRequiredForNextLevel = this.Level * Player.XP_INCREMENT * sqrt(this.Level);
    
    if(this.Level == Player.MAX_LEVEL && this.XPGatheredForNextLevel > this.XPRequiredForNextLevel)
    {
        this.XP = this.XPRequiredForNextLevel + XPToCurrentLevel;
    }
    
    this.XPGatheredForNextLevel = this.XP - XPToCurrentLevel;
    
    this.experience = (float(this.XPGatheredForNextLevel) * 100) / float(this.XPRequiredForNextLevel);
};