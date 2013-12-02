var Entity = function() {
	this.name = "";
	this.level = 1;
	this.exp = 0;
	this.gold = 0;
	this.inventory = [];
}

Entity.prototype.setName = function(x){
	this.name = x;
}