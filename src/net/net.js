var Net = {
    connected: false,
    connecting: false,

    uri: null,

    socket: null,

    init: function () {
        this.connected = false;
        this.connecting = false;
        this.uri = Settings.ServerUri;

        this.resetConnection();
    },

    resetConnection: function () {
        if (this.socket != null) {
            try {
                this.socket.close();
            } catch (e) { }

            this.socket = null;
        }

        this.connecting = false;
        this.connected = false;
        this.connect();
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
        }.bind(this));
    }
};