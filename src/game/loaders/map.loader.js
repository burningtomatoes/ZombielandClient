var MapLoader = Loader.extend({
    innerLoad: function (filename) {
        var map = new Map();
        map.onLoadComplete = function () { };

        var configureMap = function () {

        };

        $.get('assets/maps/' + filename)
        .success(function(data) {
            configureMap(data);
            map.onLoadComplete(true);
        })
        .error(function() {
            map.onLoadComplete(false);
        });

        return map;
    }
});