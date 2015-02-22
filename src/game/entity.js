var Entity = Class.extend({
    isCharacter: false,
    isZombie: false,
    isPlayer: false,

    causesCollision: true,
    receivesCollision: false,

    id: 0,
    remoteUid: 0,

    posX: 32,
    posY: 32,

    height: 32,
    width: 16,
    rotation: 0,

    init: function () {

    },

    update: function () {

    },

    draw: function (ctx) {
        var destX = Camera.translateX(this.posX);
        var destY = Camera.translateY(this.posY);

        ctx.save();

        // Step 0: Translate to our on screen position
        ctx.translate(Camera.translateX(this.posX), Camera.translateY(this.posY));

        // Step 1: Translate to our center point and rotate to our desired rotation
        var centerX = this.width / 2;
        var centerY = this.height / 2;

        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation * Math.PI / 180);

        // Step 2: De-translate
        ctx.translate(-centerX, -centerY);

        // Step 3: Draw
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    },

    isLocalPlayer: function () {
        return this.isPlayer && Session.userId == this.remoteUid;
    }
});