var InfoGUI = function (info, character, type) {
    this.info = info;
    this.character = character;

    this.alpha = 1.5;
    this.color = "black";
    switch (type) {
        case "damage":
            this.color = "red";
            break;
        case "heal":
            this.color = "green";
            break;
        case "levelup":
            this.color = "yellow";
            break;
    }
}

InfoGUI.prototype.render = function(g) {
    g.save();
    if (this.color == "yellow")
        g.translate(this.character.x - 25, this.character.y - this.character.centerY - 20);
    else g.translate(this.character.x, this.character.y - this.character.centerY - 20);
    g.globalAlpha = this.alpha;
    g.fillStyle = this.color;
    g.font = "bold 12px Arial";
    g.fillText(this.info, 0, 0);
    g.restore();

    this.alpha -= 0.03;
    this.y -= 3;
}