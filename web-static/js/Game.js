var Game = function(){
	var self = this;
	var sleep = 3;
	this.localTime = 0;
	this.globalTime = 0;
	
	var win = new Window('main-window', document.getElementById("gui"));
	
	infoPage = new InfoPage();
	try{
		win.addPage("info", infoPage);
		win.addPage("description", new Page("<strong>Created by</strong> Xaleis"));
		win.addPage("equipement", new Page("sword"));
	}catch(e){
		console.log("New Exception : " + e);
	}
	
	$scene = $("#main-scene");

	$("#gui").append($("<div>").button().css({position: "absolute", top:"5px", left:"5px"}).append("Menu").click(function(){
		if($(win.root).hasClass("visible")){
			$(win.root).removeClass("visible");
		} else {
			$(win.root).addClass("visible");
		}
	}));
	//$(win.root).hide();

	var imageRep = "/RPG-static/img/";
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
	this.assetManager = new AssetManager();
	this.assetManager.startLoading(imageList,soundList);
	this.ambientSound = this.assetManager.getSound("music");
	
	player = new Player(this.assetManager);
	camera = new Camera(player);
	
	infoPage.refreshData({
		name: "Player",
		title: "Level " + player.Level,
		xp: player.XP,
		hp: player.Health,
		power: 25,
		Gold: player.gold,
		progress: (player.experience/100)
	});
	
	this.mobList = [];
  
	/*setTimeout(function() {
     
    }, 2000);*/
	setInterval(function() {
		if(self.mobList.length < 20) {
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
	
	//this.ambientSound.play();
	
	requestAnimFrame(
		function loop() {
			self.mainLoop();
			requestAnimFrame(loop);
		}					
	);
	this.canvas = $(".scene-view").get(0);
	this.graphics = this.canvas.getContext("2d");
};
Game.prototype.setAmbientSound = function(sound){
	this.ambientSound.pause();
	if(sound){
		this.ambientSound = this.assetManager.getSound(sound);
		this.ambientSound.play();
	}
}
Game.prototype.mainLoop = function(){
	var now = Date.now();
	var globalTimeDelta = now - this.globalTime;
	var localTimeDelta = Math.min(50, globalTimeDelta);
	this.localTime += localTimeDelta;
	
	this.graphics.canvas = this.canvas;
	this.graphics.drawTimeMillis = now;
	
	this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
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
		
		for(var i in this.mobList) {
            if(this.mobList[i].y < player.y) {
                this.mobList[i].render(this.graphics);
            } else {
                if(!bRenderPlayer){
					player.render(this.graphics);
				}
                this.mobList[i].render(this.graphics);
			}
        }
		
		if(!bRenderPlayer){
			player.render(this.graphics);
		}

        this.graphics.restore();
    }
    if(!this.assetManager.isDoneLoading() || loadingAlpha > 0){
        if(this.assetManager.isDoneLoading()) {
            this.graphics.globalAlpha = loadingAlpha;
        }
            this.assetManager.renderLoadingProgress(this.graphics);
            this.graphics.globalAlpha = 1;
    }
	
    infoPage.refreshData({
        name: "Player",
        title: "Level " + player.Level,
        xp: player.XP,
        hp: player.Health,
        power: 25,
        Gold: player.gold,
        progress: (player.experience / 100)
    });

	/*if(!this.assetManager.isDoneLoading()){
		this.assetManager.renderLoadingProgress(this.graphics);
	} else {
		this.graphics.save();
		camera.render(this.graphics);
		this.graphics.drawImage(this.assetManager.getImage("background"), 0, 0);
		
		this.graphics.restore();
	}

	player.update(localTimeDelta / 1000);*/
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