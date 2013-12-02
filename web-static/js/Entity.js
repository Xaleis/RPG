var Entity = function() {
	this.name = "";
	this.x = 0;
	this.y = 0;
	this.gold = 0;
}

Entity.prototype.setName = function(x){
	this.name = x;
}

Entity.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
}