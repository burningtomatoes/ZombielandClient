var Game = {
    buildCode: 1000,

    images: null,
    audio: null,

    titleMode: false,

    initialized: false,
    started: false,

    init: function () {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        console.info('[Game] Initializing Zombieland R' + this.buildCode + '...');

        Canvas.init();
        Keyboard.bind();

        this.images = new ImageLoader();
        this.audio = new AudioLoader();
    },

    clear: function () {
        this.started = false;

        if (Canvas.$element.is(':visible')) {
            Canvas.$element.stop().fadeOut('fast');
        }
    },

    start: function () {
        this.clear();

        console.info('[Game] Starting game...');

        var onStarted = function () {
            $('#game').fadeIn('fast');

            var loginDialog = new Dialog('dl-login');
            loginDialog.show();
        }.bind(this);

        BootLogo.show(onStarted);
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