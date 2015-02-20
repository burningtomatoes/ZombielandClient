var Game = {
    buildCode: 1000,

    images: null,
    audio: null,

    init: function () {
        console.info('[Game] Initializing Zombieland R' + this.buildCode + '...');

        Canvas.init();
        Keyboard.bind();

        this.images = new ImageLoader();
        this.audio = new AudioLoader();
    },

    start: function () {
        console.info('[Game] Starting game...');

        Canvas.$canvas.hide();

        BootLogo.show(function() {
            $('#game').show();
        });
    },

    draw: function (ctx) {
        Camera.update();

        ctx.rect(0, 0, 50, 50);
        ctx.fillStyle = 'red';
        ctx.fill();
    },

    update: function () {
        Keyboard.update();
    }
};