var AssetManager = function(){
	this.images = {};
	this.sounds = {};
	this.imagesError = {};
	this.imagesToLoad = {};
	this.soundsToLoad = {};
	this.loadingStarted = false;
};
AssetManager.prototype.loadImage = function(url, id){
	var _this = this;
	if(!id){
		id = url;
	}
	var img = this.images[id];
	if(!img){
		this.imagesToLoad[id] = url;
		img = new Image();
		img.onload = function(){
			delete _this.imagesToLoad[id];
			_this.assetLoaded();
		};
		img.onerror = function(){
			delete _this.imagesToLoad[id];
			_this.imagesError[id] = id;
			_this.assetLoaded();
		};
		img.src = url;
		this.images[id] = img;
	}else{
		this.assetLoaded();
	}
	return img;
};
AssetManager.prototype.loadSound = function(url, id, onload){
	var _this = this;
	if(!id){
		id = url;
	}
	if(this.sounds[id]){
		this.assetLoaded();
	}else{
		this.soundsToLoad[id] = url;
		/*var sound = soundManager.createSound({
			id: id,
			url: url,
			autoLoad: true,
			autoPlay: false,
			onload: function() {
				delete _this.soundsToLoad[id];
				_this.assetLoaded();
				if(onload){
					onload(sound);
				}
			},
			volume: 100
		});
		
		sound.playLoop = function(){
			this.play({			
				onfinish: function() {
					if(!this._play || user.data.soundEnabled){
						this.playLoop();
					}
				}
			});
		};
		this.sounds[id] = sound;*/
		var soundElem = new Audio();
		soundElem.addEventListener("canplay", function(){
			delete _this.soundsToLoad[id];
			_this.assetLoaded();
		});
		soundElem.addEventListener("stalled", function(){
			delete _this.soundsToLoad[id];
			console.log("error " + url);
			_this.assetLoaded();
		});
		var sourceElem = document.createElement("source");
		sourceElem.src = url;
		switch(url.substring(url.length - 3)){
			case 'mp3':
				sourceElem.type = "audio/mp3";
				break;
			case 'wav':
				sourceElem.type = "audio/wav";
				break;
			case 'ogg':
				sourceElem.type = "audio/ogg";
				break;
		}
		soundElem.appendChild(sourceElem);
		document.body.appendChild(soundElem);
		
		this.sounds[id] = soundElem;
	}
	return this.sounds[id];
};

AssetManager.prototype.assetLoaded = function(){
	this.totalAssetLoaded++;
	this.loadingTime = Date.now() - this.loadingStartTime;
	this.loadingEndTime = Date.now();
};
AssetManager.prototype.renderLoadingProgress = function(g){
	//console.log(this.getLoadingProgress());
	/*g.fillStyle = "white";
	g.fillRect(0, 0, g.canvas.width, g.canvas.height);*/
	
	g.strokeStyle = "red";
	g.strokeRect(g.canvas.width/2 - 200, g.canvas.height/2 - 20, 400, 40);
	
	g.fillStyle = "pink";
	g.fillRect(g.canvas.width/2 - 200, g.canvas.height/2 - 20, parseInt(this.getLoadingProgress()*400), 40);
	
	g.font = "16px gunship";
	g.fillStyle = "purple";
	g.fillText("Chargement : " + parseInt(this.getLoadingProgress()*100) + "%", g.canvas.width/2 - 125, g.canvas.height/2 + 5);
};

AssetManager.prototype.isDoneLoading = function(){
	return this.totalAssetCount == this.totalAssetLoaded;
};

AssetManager.prototype.startLoading = function(loadingList, soundLoadingList){
	this.loadingStartTime = Date.now();
	
	this.totalAssetLoaded = 0;
	this.totalAssetCount = 0;
	for(var i in loadingList){
		this.totalAssetCount++;
	}
	for(var i in soundLoadingList){
		this.totalAssetCount++;
	}
	this.loadingStarted = true;
	for(var i in soundLoadingList){
		this.loadSound(soundLoadingList[i], i);
	}
	for(var i in loadingList){
		this.loadImage(loadingList[i], i);
	}
};
AssetManager.prototype.getLoadingProgress = function(){
	if(this.totalAssetCount == 0){
		return 0;
	}else{
		return this.totalAssetLoaded / this.totalAssetCount;
	}
};

AssetManager.prototype.getImage = function(id){
	return this.images[id];
};

AssetManager.prototype.getSound = function(id){
	return this.sounds[id];
};