var Entity = Class.extend({
    isCharacter: false,
    isZombie: false,
    isPlayer: false,

    name: '???',

    causesCollision: true,
    receivesCollision: false,

    id: 0,
    remoteUid: 0,

    posX: 32,
    posY: 32,

    height: 32,
    width: 16,
    rotation: 0,

    moving: false,
    running: false,

    speedWalking: 2,
    speedRunning: 4,
    speedRotate: 5,

    init: function () {

    },

    update: function () {
        if (this.rotation < 0) {
            this.rotation += 360;
        }

        if (this.rotation > 360) {
            this.rotation -= 360;
        }

        if (this.moving) {
            var mvSpeed = this.running ? this.speedRunning : this.speedWalking;

            this.posX += mvSpeed * Math.cos(this.rotation * Math.PI / 180);
            this.posY += mvSpeed * Math.sin(this.rotation * Math.PI / 180);
        }
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

        // Step 3: Draw entity
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();

        ctx.restore();

        // Step 4: Entity name
        ctx.font="8px Pixelmix";

        destX += (this.width / 2) - (ctx.measureText(this.name).width / 2);
        destY -= 5;

        ctx.fillStyle = '#000';
        ctx.fillText(this.name, destX + 1, destY + 1);
        ctx.fillStyle = '#fff';
        ctx.fillText(this.name, destX, destY);
    },

    isLocalPlayer: function () {
        return this.isPlayer && Session.userId == this.remoteUid;
    }
});