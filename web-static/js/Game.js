var Game = function(){
	var self = this;
	var sleep = 3;
	this.localTime = 0;
	this.globalTime = 0;
	

	//var win = new Window('main-window', document.getElementById("gui"));
	var win = new Window('main-window', document.getElementById("gui"));
	
	infoPage = new InfoPage();
	try{
		win.addPage("info", infoPage);
		win.addPage("description", new Page("<strong>hello</strong> world"));
		win.addPage("equipement", new Page("lorem ipsum"));
	}catch(e){
		console.log("New Exception : " + e);
	}
	
	infoPage.refreshData({
		name: "Johnny",
		title: "be good",
		xp: 200,
		hp: 643,
		power: 65,
		progress: 0.8
	});
	$scene = $("#main-scene");

	$("#gui").append($("<div>").button().css({position: "absolute", top:"5px", left:"5px"}).append("Menu").click(function(){
		if($(win.root).hasClass("visible")){
			$(win.root).removeClass("visible");
		} else {
			$(win.root).addClass("visible");
		}
	}));
	/*$(win.root).hide();*/

	player = new Player();
	camera = new Camera(player);

	player.setPosition(3530, 1770);
	player.init();
	
	requestAnimFrame(
		function loop() {
			self.mainLoop();
			requestAnimFrame(loop);
		}					
	);
	this.canvas = $(".scene-view").get(0);
	this.graphics = this.canvas.getContext("2d");
	
	var imageList = {
		"background": "/cours-web-static/img/getImage.php?url=forest.jpg&sleep=" + sleep,
		"player-idle": "/cours-web-static/img/getImage.php?url=sprite/idle-1-2-1.png&sleep=" + sleep,
		"player-attack": "/cours-web-static/img/getImage.php?url=sprite/attack-1-2-1.png&sleep=" + sleep,
		"player-move": "/cours-web-static/img/getImage.php?url=sprite/move-1-2-1.png&sleep=" + sleep,
		"mob-idle": "/cours-web-static/img/getImage.php?url=sprite/idle-1.png&sleep=" + sleep,
		"mob-damage": "/cours-web-static/img/getImage.php?url=sprite/damage-1.png&sleep=" + sleep,
		"mob-attack": "/cours-web-static/img/getImage.php?url=sprite/attack-1.png&sleep=" + sleep,
		"mob-death": "/cours-web-static/img/getImage.php?url=sprite/death-1.png&sleep=" + sleep
	};
	var soundList= {};
	this.assetManager = new AssetManager();
	this.assetManager.startLoading(imageList,soundList);
};
Game.prototype.mainLoop = function(){
	var now = Date.now();
	var globalTimeDelta = now - this.globalTime;
	var localTimeDelta = Math.min(50, globalTimeDelta);
	this.localTime += localTimeDelta;
	
	this.graphics.canvas = this.canvas;
	this.graphics.drawTimeMillis = now;
	
	this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	if(!this.assetManager.isDoneLoading()){
		this.assetManager.renderLoadingProgress(this.graphics);
	} else {
		this.graphics.save();
		camera.render(this.graphics);
		this.graphics.drawImage(this.assetManager.getImage("background"), 0, 0);
		
		this.graphics.restore();
	}

	player.update(localTimeDelta / 1000);
};