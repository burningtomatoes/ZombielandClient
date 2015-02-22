var MapLoader = Loader.extend({
    readCache: function (id, defaultValue) {
        var data = this._super(id, defaultValue);

        if (data.isMap) {
            // Clear all entities before returning maps from cache
            data.clear();
            data.onLoadComplete();
        }

        return data;
    },

    innerLoad: function (filename) {
        var map = new Map();
        map.onLoadComplete = function () { };

        var configureMap = function (data) {
            map.data = data;
            map.layers = data.layers;

            map.widthTiles = data.width;
            map.heightTiles = data.height;
            map.widthPx = data.width * Settings.TileSize;
            map.heightPx = data.height * Settings.TileSize;

            var props = map.data.properties;

            if (props.name) {
                map.name = props.name;
            }

            var tilesetSrc = data.tilesets[0].image;
            tilesetSrc = tilesetSrc.replace('../images/', '');
            map.tileset = Game.images.load(tilesetSrc);

            map.tilesPerRow = data.tilesets[0].imagewidth / Settings.TileSize;
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