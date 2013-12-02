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
	
	this.spriteName = "/RPG-resources/img/sprite/clotharmor.png";
    this.weaponName = "/RPG-resources/img/sprite/sword1.png";
	
	MAX_LEVEL = 50; // Level max
	XP_INCREMENT = 500; // Amount of XP that is added to the amount of XP required for a level, after each level progression
	
	this.Level = 1; // Current level
	this.XP = 0; // Total amount of gathered XP
	this.XPGatheredForNextLevel = 0; // Amount of XP gathered for the next level
	this.XPRequiredForNextLevel = 0; // Amount of XP required for the next level
	
	this.HealthMax = 100;
	this.Health = this.HealthMax;

	/*this.spriteList = {
		"idle-left": new Sprite(this.$elm, "idle-left", "/cours-web-static/img/sprite/revert-idle-1-2-1.png", 2048, 256, 16, 2, true),
		"idle-right": new Sprite(this.$elm, "idle-right", "/cours-web-static/img/sprite/idle-1-2-1.png", 2048, 256, 16, 2, true),
		"attack-left": new Sprite(this.$elm, "attack-left", "/cours-web-static/img/sprite/revert-attack-1-2-1.png", 2048, 128, 16, 1, false),
		"attack-right": new Sprite(this.$elm, "attack-right", "/cours-web-static/img/sprite/attack-1-2-1.png", 2048, 128, 16, 1, false),
		"move-left": new Sprite(this.$elm, "move-left", "/cours-web-static/img/sprite/revert-move-1-2-1.png", 896, 128, 7, 1, true),
		"move-right": new Sprite(this.$elm, "move-right", "/cours-web-static/img/sprite/move-1-2-1.png", 896, 128, 7, 1, true)
	};

	this.keyList = {};
	this.spriteList["move-left"].frameCount = 6;
	this.spriteList["move-right"].frameCount = 6;
	this.revertDirection = false;
	this.setSprite("idle");*/
};
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
				break;
				case "115", "83":
					//this.revertDirection = false;
					move.y = 1;
				break;
				case "100", "68":
					this.revertDirection = false;
					move.x = 1;
				break;
				case "122", "90":
					//this.revertDirection = true;
					move.y = -1;
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

/* fonction UDK à retranscrire
function DeadPlayer()
{
    XP = XP - (Level * 100);
    if(Level == 1 && XP < 0)
    {
        XP = 0;
    }
    CalculateLevelProgress();
    if(XPGatheredForNextLevel < 0)
    {
        Level--;
        vitality -= 5;
        SetLife();
        strength -= 5;
        agility -= 5;
        
        CalculateLevelProgress();
    }
}

function GiveXP(int amount)
{
    XP += amount;

    CalculateLevelProgress();

    while (XPGatheredForNextLevel >= XPRequiredForNextLevel && Level < MAX_LEVEL)
    {
        LevelUp();

        // Recalculate level progress after leveling up
        CalculateLevelProgress();
    }
}

private function CalculateLevelProgress()
{
    local int XPToCurrentLevel; // Total amount of XP gathered with current and previous levels
    local int tmp;
    
    tmp = Level-1;
    
    while(tmp != 0)
    {
        XPToCurrentLevel += tmp * XP_INCREMENT * sqrt(tmp);
        tmp--;
    }
    
    XPRequiredForNextLevel = Level * XP_INCREMENT * sqrt(Level);
    
    if(Level == MAX_LEVEL && XPGatheredForNextLevel > XPRequiredForNextLevel)
    {
        XP = XPRequiredForNextLevel + XPToCurrentLevel;
    }
    
    XPGatheredForNextLevel = XP - XPToCurrentLevel;
    
    experience = (float(XPGatheredForNextLevel) * 100) / float(XPRequiredForNextLevel);
}*/