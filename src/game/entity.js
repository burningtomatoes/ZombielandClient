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

    width: 24,
    height: 40,

    widthHead: 21,
    heightHead: 23,

    rotation: 0,

    moving: false,
    running: false,

    speedWalking: 2,
    speedRunning: 4,
    speedRotate: 5,

    imgHead: null,
    imgBody: null,

    headBobTimer: 0,
    headBob: 0,

    init: function () {
        this.imgBody = Game.images.load('body_2.png');
        this.imgHead = Game.images.load('head_z_1.png');
        this.rotation = 270;
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

        if (this.moving) {
            if (this.headBobTimer > 0) {
                this.headBobTimer--;
            }

            if (this.headBobTimer <= 0) {
                this.headBob = (this.headBob == 1 ? -1 : 1);
                this.headBobTimer = 15;
            }
        } else {
            this.headBob = 0;
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
        if (this.imgBody == null) {
            ctx.beginPath();
            ctx.rect(0, 0, this.width, this.height);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.closePath();
        } else {
            ctx.drawImage(this.imgBody, 0, 0, this.width, this.height, 0, Math.round(this.headBob / 2), this.width, this.height);
        }

        if (this.imgHead != null) {
            ctx.drawImage(this.imgHead, 0, 0, this.widthHead, this.heightHead, 6, Math.round((this.height / 2) - (this.heightHead / 2) - (this.headBob / 2)), this.widthHead, this.heightHead);
        }

        ctx.restore();

        if (Settings.drawCollisions) {
            var r = this.getRect();

            ctx.beginPath();
            ctx.rect(Camera.translateX(r.left), Camera.translateY(r.top), r.width, r.height);
            ctx.strokeStyle = "#FFCCAA";
            ctx.stroke();
            ctx.closePath();
        }

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
    },

    getRect: function (overrideX, overrideY) {
        var x = this.posX;
        var y = this.posY;

        if (overrideX != null) {
            x = overrideX;
        }

        if (overrideY != null) {
            y = overrideY;
        }

        var w = 32;
        var h = 32;

        var margin = 6;

        var rect = {
            left: x,
            top: y + 6,
            height: h - margin,
            width: w - margin
        };
        rect.bottom = rect.top + rect.height;
        rect.right = rect.left + rect.width;
        // TODO Specific collision masks for left/right directions?
        return rect;
    },

    canMoveLeft: function () {
        if (!this.clipping) {
            return true;
        }
        var projectedPosX = this.posX - this.movementSpeed;
        var projectedRect = this.getRect(projectedPosX, null);
        return !Game.map.isRectBlocked(projectedRect, this.isNpc, this);
    },

    canMoveRight: function () {
        if (!this.clipping) {
            return true;
        }
        var projectedPosX = this.posX + this.movementSpeed;
        var projectedRect = this.getRect(projectedPosX, null);
        return !Game.map.isRectBlocked(projectedRect, this.isNpc, this);
    },

    canMoveUp: function () {
        if (!this.clipping) {
            return true;
        }
        var projectedPosY = this.posY - this.movementSpeed;
        var projectedRect = this.getRect(null, projectedPosY);
        return !Game.map.isRectBlocked(projectedRect, this.isNpc, this);
    },

    canMoveDown: function () {
        if (!this.clipping) {
            return true;
        }
        var projectedPosY = this.posY + this.movementSpeed;
        var projectedRect = this.getRect(null, projectedPosY);
        return !Game.map.isRectBlocked(projectedRect, this.isNpc, this);
    },
});