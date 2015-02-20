var Login = Dialog.extend({
    init: function () {
        $('.dialog').remove();

        this._super('dl-login');
    },

    bind: function () {
        // ...
    },

    show: function () {
        this._super();
        $('#net-status').fadeIn('fast');
    },

    hide: function () {
        this._super();
        $('#net-status').fadeOut('fast');
    }
});