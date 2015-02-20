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

        });
    },

    draw: function (ctx) {
        Camera.update();
    },

    update: function () {
        Keyboard.update();
    }
};