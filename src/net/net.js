var Net = {
    connected: false,
    connecting: false,

    uri: null,

    socket: null,

    retryDelay: 0,
    retryTimeout: null,

    init: function () {
        this.connected = false;
        this.connecting = false;
        this.uri = Settings.ServerUri;
        this.retryDelay = 1000;

        this.resetConnection();
    },

    resetConnection: function () {
        if (this.retryDelay <= 10000) {
            this.retryDelay += chance.integer({
                min: 500,
                max: 1000
            });
        }

        if (this.socket != null) {
            try {
                this.socket.close();
            } catch (e) { }

            this.socket = null;
        }

        this.connecting = false;
        this.connected = false;

        if (this.retryTimeout != null) {
            console.info('[Net] Retrying connection in ' + (this.retryDelay / 1000).toFixed(2).toString() + ' seconds...');
            window.clearTimeout(this.retryTimeout);
        }

        this.retryTimeout = window.setTimeout(this.connect.bind(this), this.retryDelay);
    },

    connect: function () {
        if (this.connected || this.connecting) {
            return;
        }

        this.connecting = true;

        console.info('[Net] Connecting to server at ' + this.uri + '...');

        this.socket = io.connect(this.uri);

        var handleError = function (e) {
            console.error('[Net](Resetting) Connection error: ', e.message);
            this.resetConnection();
        }.bind(this);

        this.socket.on('connect_error', handleError);
        this.socket.on('reconnect_failed', handleError);

        this.socket.on('connect_timeout', function (e) {
            console.warn('[Net](Resetting) Connection timeout reached.', e);
            this.resetConnection();
        }.bind(this));

        this.socket.on('connect', function (e) {
            console.info('[Net] Connection established successfully.');
            this.connected = true;
            this.retryDelay = 0;
        }.bind(this));
    }
};