var Game = function(_assetManager){
	var self = this;
	var sleep = 3;
	this.localTime = 0;
	this.globalTime = 0;
	this.bSound = true;
	this.gameEnabled = false;
	
	var win = new Window('main-window', document.getElementById("gui"));
	
	$scene = $("#main-scene");

	var imageRep = "/RPG-static/img/";
	var img = new Image();
	img.src = imageRep + "Button.png";

	$("#gui").append($("<div>").css({position: "absolute", top:"10%", left:"95%"}).append(img).click(function(){
		if($(win.root).hasClass("visible")){
			$(win.root).removeClass("visible");
		} else {
			$(win.root).addClass("visible");
		}
	}));

	var imageList = {
		"background": 	imageRep + "forest.jpg",
		"clotharmor": 	imageRep + "sprite/clotharmor.png",
		"axe": 			imageRep + "sprite/axe.png",
		"bluesword": 	imageRep + "sprite/bluesword.png",
		"redsword": 	imageRep + "sprite/redsword.png",
		"sword": 		imageRep + "sprite/sword1.png",
		"goblin": 		imageRep + "sprite/goblin.png",
		"boss": 		imageRep + "sprite/boss.png"
	};
	var soundRep = "/RPG-static/sound/";
	var soundList= {
		"music": 	soundRep + "01 Swordland.mp3",
		"music2":	soundRep + "03 Everyday Life.mp3",
		"music3": 	soundRep + "13 March Down.mp3",
		"music4": 	soundRep + "15 We Have To Defeat It.mp3",
		"music5": 	soundRep + "16 At Our Parting.mp3",
		"music6": 	soundRep + "19 Luminous Sword.mp3",
		"death": 	soundRep + "Death.mp3",
		"heal": 	soundRep + "Heal.mp3",
		"hit": 		soundRep + "Hit.mp3",
		"hurt": 	soundRep + "Hurt.mp3",
		"kill": 	soundRep + "Kill.mp3"
	};
	if (_assetManager == null) {
	    this.assetManager = new AssetManager();
	    this.assetManager.startLoading(imageList, soundList);
	} else {
	    this.assetManager = _assetManager;
	}
	this.ambientSound = this.assetManager.getSound("music3");
	
	player = new Player(this.assetManager, 3530, 1770);
	camera = new Camera(player);
	
	this.infoPage = new InfoPage();
    try {
        win.addPage("info", this.infoPage);
        win.addPage("description", new Page("<br/>Created by : Xaleis<br/>Inspiration : Browser Quest"));
        win.addPage("equipement", new Page("<br/>Armor: " + player.playerSprite + "<br/>Weapon: " + player.weaponSprite));
    } catch (e) {
        console.log("New Exception : " + e);
    }

    this.infoPage.refreshData({
	    name: player.name,
		title: "Level " + player.Level,
		xp: player.XP,
		hp: player.Health,
		power: 25,
		Gold: player.gold,
		progress: (player.experience/100)
	});
	
	this.mobList = [];
	this.infoGUI = [];
  
	/*setTimeout(function() {
     
    }, 2000);*/
	setInterval(function() {
		if(self.mobList.length < 5) {
			tempo = new Enemy(self.assetManager, parseInt(Math.random() * 5 + 1));
			self.mobList.push(tempo);
			self.mobList.sort(function(a, b) {
				if(a.y < b.y) {
					return -1;
				} else if(a.y == b.y) {
					return 0;
				} else {
					return 1;
				}
			});
		}
    }, 2000);

	player.setPosition(3530, 1770);
	player.init();

    /* Créer le HUD du joueur */
	this.HUD = new HUD(player);
	$("#gui").append($("<div>").append(this.HUD));

    /* Bouton son activé / désactivé */
	var img_sound = new Image();
	img_sound.src = imageRep + "sound_on.png";
	$("#gui").append($("<div>").css({ position: "absolute", top: "5px", left: "95%" }).append(img_sound).click(function () {
	    if (self.bSound) {
	        img_sound.src = imageRep + "sound_off.png";
	        self.bSound = false;
	        self.ambientSound.pause();
	    } else {
	        img_sound.src = imageRep + "sound_on.png";
	        self.bSound = true;
	        self.ambientSound.play();
	    }
	}));

    /* Pause appuie sur echap pour y enter et en sortir */
	this.bPause = false;
	this.$pause = $("<div>").css({ position: "absolute", top: "50%", left: "50%", "margin-left": "-50px", "font-family": "gunship-condensed", "font-size": "22px", cursor: "default" }).append("Pause");
	$("#gui").append(this.$pause);
	this.$pause.hide();

    /* Menu principal */
	var fondMenu = new Image();
	fondMenu.src = "/RPG-static/img/images/background-menu.png";
	this.$menu = $("<div>").css({ position: "absolute", top: "0px", left: "0px", width: "1024px", height: "600px" }).append(fondMenu);
	$("#gui").append(this.$menu);
	this.$menu.hide();
	this.$newGame = $("<div>").css({ position: "absolute", top: "70%", left: "50%", "margin-left": "-50px", "font-family": "gunship", "font-size": "18px", cursor: "pointer" }).append("New Game").click(function () {
	    self.gameEnabled = true;
	});
	this.$menu.append(this.$newGame);
	this.$credit = $("<div>").css({ position: "absolute", top: "97%", right: "1%", "font-family": "gunship", "font-size": "11px", cursor: "default" }).append("© Copyright 2014 - Created by Xaleis");
	this.$menu.append(this.$credit);
	this.$gameOver = $("<div>").css({ position: "absolute", top: "30%", left: "50%", "margin-left": "-200px", "font-family": "gunship-condensed", "font-size": "36px", cursor: "default" }).append("Game Over");
	this.$menu.append(this.$gameOver);
	this.$replay = $("<div>").css({ position: "absolute", top: "70%", left: "50%", "margin-left": "-50px", "font-family": "gunship", "font-size": "18px", cursor: "pointer" }).append("Replay").click(function () {
	    self.Reboot();
	});
	this.$menu.append(this.$replay);
	
    /* Jouer un son d'ambience si le son est activé */
	/*if (this.bSound) {
	    this.ambientSound.play();
	}*/
	this.ambientSound.loop = true;
	
	requestAnimFrame(
		function loop() {
			self.mainLoop();
			requestAnimFrame(loop);
		}					
	);
	this.canvas = $(".scene-view").get(0);
	this.graphics = this.canvas.getContext("2d");
};
Game.prototype.Pause = function () {
    if (!this.bPause) {
        this.$pause.show();
        this.bPause = true;
    } else {
        this.$pause.hide();
        this.bPause = false;
    }
}
Game.prototype.Menu = function () {
    this.$menu.show();
    if (player.isDead) {
        this.$newGame.hide();
        this.$gameOver.show();
        this.$replay.show();
    } else {
        this.$newGame.show();
        this.$gameOver.hide();
        this.$replay.hide();
    }
    this.$credit.show();
}
Game.prototype.setAmbientSound = function(sound){
	this.ambientSound.pause();
	if(sound){
		this.ambientSound = this.assetManager.getSound(sound);
		this.ambientSound.play();
	}
}
Game.prototype.mainLoop = function () {
	var now = Date.now();
	var globalTimeDelta = now - this.globalTime;
	var localTimeDelta = Math.min(50, globalTimeDelta);
	this.localTime += localTimeDelta;
	
	this.graphics.canvas = this.canvas;
	this.graphics.drawTimeMillis = now;
	
	//this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);

	if (!this.gameEnabled) {
	    this.Menu();
	} else {
	    if (!this.bPause) {
	        this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
	        this.$menu.hide();
	        if (this.bSound) {
	            this.ambientSound.play();
	        }
	        var fadeDuration = 5000;
	        var loadingAlpha = 0;
	        var playerStatus = false;
	        if (this.assetManager.isDoneLoading()) {
	            loadingAlpha = tween(1, 0, this.assetManager.loadingEndTime, fadeDuration, "easeInOut");
	            this.graphics.save();
	            camera.render(this.graphics);
	            this.graphics.drawImage(this.assetManager.getImage("background"), 0, 0);

	            player.update(localTimeDelta / 1000);

	            var bRenderPlayer = false;

	            for (var i in this.mobList) {
	                //if ($.CalculateDistance(this.mobList[i].x, this.mobList[i].y, player.x, player.y) < 200) {
	                var j = i;
	                this.mobList[j].deplacement(player, this.localTime, localTimeDelta / 1000);
	                //this.infoGUI.push(new InfoGUI(10, player, "damage"));
	                //}
	                if (this.mobList[i].y < player.y) {
	                    this.mobList[i].render(this.graphics);
	                } else {
	                    if (!bRenderPlayer) {
	                        player.render(this.graphics);
	                    }
	                    this.mobList[i].render(this.graphics);
	                }
	            }

	            if (!bRenderPlayer) {
	                player.render(this.graphics);
	            }

	            for (var i in this.infoGUI) {
	                if (this.infoGUI[i].alpha > 0)
	                    this.infoGUI[i].render(this.graphics);
	                else this.infoGUI.splice(i, 1);
	            }

	            this.HUD.SetPosition(-camera.x, -camera.y);
	            this.HUD.render(this.graphics);

	            this.graphics.restore();
	        }
	        if (!this.assetManager.isDoneLoading() || loadingAlpha > 0) {
	            if (this.assetManager.isDoneLoading()) {
	                this.graphics.globalAlpha = loadingAlpha;
	            }
	            this.assetManager.renderLoadingProgress(this.graphics);
	            this.graphics.globalAlpha = 1;
	        }

	        this.infoPage.refreshData({
	            name: player.name,
	            title: "Level " + player.Level,
	            xp: player.XP,
	            hp: player.Health,
	            power: 25,
	            Gold: player.gold,
	            progress: (player.experience / 100)
	        });
	    }
	}
};
var TWEEN_FACTOR = 1.5;
var TWEEN_EXPO_FACTOR = 4;
function tween(from, to, startTime, duration, easing) {
    var now = Date.now();
    var t = (now - startTime) / duration;
    t = Math.max(0, Math.min(1, t));
    if(typeof(easing) != "undefined") {
        switch(easing) {
			case "easeOut":
                t = Math.pow(t, 1/ TWEEN_FACTOR);
                break;
            case "easeIn":
                t = Math.pow(t, TWEEN_FACTOR);
                break;
            case "easeOutExpo":
                t = Math.pow(t, 1/ TWEEN_EXPO_FACTOR);
                break;
            case "easeInExpo":
				t = Math.pow(t, TWEEN_EXPO_FACTOR);
                break;
            case "easeOutSine":
                t = Math.sin(t * Math.PI / 2);
                break;
            case "easeInSine":
                t = Math.sin((t - 1) * Math.PI / 2) + 1;
                break;
            case "easeInOut":
                t = Math.sin((t - 0.5) * Math.PI) / 2 + 0.5;
				break;
        }
    }
    return t * (to - from) + from;
};
Game.prototype.Reboot = function () {
    this.$newGame.remove();
    this.$gameOver.remove();
    this.$replay.remove();
    this.$credit.remove();
    this.$menu.remove();
    /* cela permet de ne pas recharger les musics et les textures */
    game = new Game(this.assetManager);
}