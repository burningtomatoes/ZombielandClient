var Map = Class.extend({
    id: null,
    name: '',
    isMap: true,

    data: { },
    layers: [ ],

    widthTiles: 0,
    heightTiles: 0,
    widthPx: 0,
    heightPx: 0,

    entities: [],
    toRemove: [],
    player: null,

    tileset: null,
    tilesPerRow: 0,

    init: function (id) {
        this.id = id;
        this.data = { };
        this.layers = [ ];
        this.widthTiles = 0;
        this.heightTiles = 0;
        this.widthPx = 0;
        this.heightPx = 0;
        this.name = '???';
        this.tilesPerRow = 0;

        this.clear();
    },

    clear: function () {
        this.entities = [];
        this.toRemove = [];
        this.player = null;
    },

    add: function (entity) {
        if (this.entities.indexOf(entity) == -1) {
            entity.map = this;
            entity.id = this.idGen++;
            this.entities.push(entity);
        }
    },

    remove: function (entity) {
        if (this.entities.indexOf(entity) == -1) {
            return false;
        }

        if (this.toRemove.indexOf(entity) === -1) {
            this.toRemove.push(entity);
            return true;
        }

        return false;
    },

    getEntityById: function (id) {
        for (var i = 0; i < this.entities.length; i++) {
            var entity = this.entities[i];

            if (entity.id === id) {
                return entity;
            }
        }

        return null;
    },

    setPlayer: function (entity) {
        if (this.getEntityById(entity.id) == null) {
            // call .add() if this entity does not yet exist on the map
            this.add(entity);
        }

        this.player = entity;
    },

    update: function () {
        // Process all pending entity removals
        this.processRemovals();

        // Process all entities on the map
        {
            for (var j = 0; j < this.entities.length; j++) {
                var entity = this.entities[j];
                entity.update();
            }
        }
    },

    processRemovals: function () {
        for (var i = 0; i < this.toRemove.length; i++) {
            var removeEntity = this.toRemove[i];
            var entityIdx = this.entities.indexOf(removeEntity);

            if (entityIdx === -1) {
                continue;
            }

            this.entities.splice(entityIdx, 1);
        }

        this.toRemove = [];
    },

    draw: function (ctx) {
        // Draw map
        this.drawBackground(ctx);

        // Draw all non-player entities on the map
        {
            for (var i = 0; i < this.entities.length; i++) {
                var entity = this.entities[i];

                if (entity.isCharacter) {
                    continue;
                }

                entity.draw(ctx);
            }
        }

        // Draw all characters (zombies, players, etc). We draw them last so they are on top.
        {
            for (var j = 0; j < this.entities.length; j++) {
                var entity = this.entities[j];

                if (!entity.isCharacter) {
                    continue;
                }

                entity.draw(ctx);
            }
        }
    },

    drawBackground: function (ctx) {
        var layerCount = this.layers.length;

        for (var i = 0; i < layerCount; i++) {
            var layer = this.layers[i];

            if (layer.type != 'tilelayer') {
                continue;
            }

            var layerDataLength = layer.data.length;

            var x = -1;
            var y = 0;

            var isBlocking = Settings.drawCollisions && typeof(layer.properties) != 'undefined' && layer.properties.blocked == '1';

            if (!Settings.drawCollisions && !layer.visible) {
                continue;
            }

            for (var tileIdx = 0; tileIdx < layerDataLength; tileIdx++) {
                var tid = layer.data[tileIdx];

                x++;

                if (x >= this.widthTiles) {
                    y++;
                    x = 0;
                }

                if (tid === 0) {
                    // Invisible (no tile set for this position)
                    continue;
                }

                tid--; // tid is offset by one, for calculation purposes we need it to start at zero

                var fullRows = Math.floor(tid / this.tilesPerRow);

                var srcY = fullRows * Settings.TileSize;
                var srcX = (tid * Settings.TileSize) - (fullRows * this.tilesPerRow * Settings.TileSize);

                var destX = Camera.translateX(x * Settings.TileSize);
                var destY = Camera.translateY(y * Settings.TileSize);

                ctx.drawImage(this.tileset, srcX, srcY, Settings.TileSize, Settings.TileSize, destX, destY, Settings.TileSize, Settings.TileSize);

                if (isBlocking) {
                    ctx.beginPath();
                    ctx.rect(destX, destY, Settings.TileSize, Settings.TileSize);
                    ctx.strokeStyle = "#FCEB77";
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }
});