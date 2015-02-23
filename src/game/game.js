var Game = {
    buildCode: 1000,

    images: null,
    audio: null,
    maps: null,

    map: null,

    initialized: false,
    started: false,

    $game: null,

    init: function () {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        console.info('[Game] Initializing Zombieland R' + this.buildCode + '...');

        Canvas.init();
        Keyboard.bind();
        Net.init();
        Chat.init();

        this.images = new ImageLoader();
        this.audio = new AudioLoader();
        this.maps = new MapLoader();

        this.$game = $('#game');
    },

    clear: function () {
        this.$game.hide();
        this.started = false;
        this.loading = false;
        this.map = null;

        Session.setStateObject(null);
    },

    start: function () {
        this.clear();

        Chat.hide();

        BootLogo.show(function () {
            this.loadMap(Settings.TitleMap);
        }.bind(this));
    },

    loading: false,

    loadMap: function (mapId) {
        if (this.loading) {
            return;
        }

        this.loading = true;

        console.info('[Map] Loading map ' + mapId + '...');

        var beginLoad = function () {
            this.map = this.maps.load(mapId + '.json');
            this.map.onLoadComplete = function (success) {
                if (success) {
                    console.info('[Map] Map loaded successfully.');
                    this.$game.fadeIn(500);
                    this.loading = false;

                    if (!Session.isLoggedIn()) {
                        this.showLogin();
                    } else {
                        Chat.show();
                    }
                } else {
                    if (mapId !== Settings.TitleMap) {
                        alert('Something went very, very wrong. I was unable to load the next map. The game will now restart.');
                        location.reload();
                    }
                }
            }.bind(this);
        }.bind(this);

        if (this.$game.is(':visible')) {
            this.$game.fadeOut(500, beginLoad);
        } else {
            beginLoad();
        }
    },

    showLogin: function () {
        var loginDialog = new Login();
        loginDialog.show();
    },

    draw: function (ctx) {
        if (!this.initialized) {
            return;
        }

        if (!this.loading && this.map != null) {
            this.map.draw(ctx);
        }
    },

    update: function () {
        if (!this.initialized) {
            return;
        }

        Chat.update();
        Camera.update();
        Keyboard.update();

        if (!this.loading && this.map != null) {
            this.map.update();
        }
    }
};