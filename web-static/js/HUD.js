var HUD = function (player) {
    this.player = player;
}

HUD.prototype.SetPosition = function(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
}

HUD.prototype.render = function (g) {
    g.save();
    g.translate(this.x, this.y);

    /* Affichage vie */
    if (parseFloat(this.player.Health / this.player.HealthMax) < 0.25)
        g.fillStyle = "b2140c";
    else if (parseFloat(this.player.Health / this.player.HealthMax) < 0.5)
        g.fillStyle = "eddb11";
    else
        g.fillStyle = "349f23";
    g.fillRect(128, 66, 254 * parseFloat(this.player.Health / this.player.HealthMax), 13);

    /* Affichage expérience */
    g.fillStyle = "fff953";
    g.fillRect(125, 82, 265 * parseFloat(this.player.experience / 100), 4);

    var charac = new Image();
    charac.src = "/RPG-static/img/character.png";
    g.drawImage(charac, 32, 25, 93, 88);

    /* Affichage HUD */
    var img = new Image();
    img.src = "/RPG-static/img/rpg_hud_1.png";
    g.drawImage(img, 0, 0, 415, 136);

    /* Affichage arme */


    /* Affichage armure */


    /* Affichage nom joueur */
    g.fillStyle = "white";
    g.font = "bold 16px Arial";
    g.fillText(player.name, 55, 95);

    g.font = "bold 16px Arial";
    g.fillText("lvl " + player.Level, 200, 58);

    g.restore();
}