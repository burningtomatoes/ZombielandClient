var Entity = Class.extend({
    isCharacter: false,
    isZombie: false,
    isPlayer: false,

    causesCollision: true,
    receivesCollision: false,

    id: 0,

    posX: 32,
    posY: 32,

    height: 32,
    width: 32,

    init: function () {

    },

    update: function () {

    },

    draw: function (ctx) {
        var destX = Camera.translateX(this.posX);
        var destY = Camera.translateY(this.posY);

        ctx.beginPath();
        ctx.rect(destX, destY, Settings.TileSize, Settings.TileSize);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();
    }
});