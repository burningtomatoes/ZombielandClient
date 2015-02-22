/**
 * Helper class for syncing entities on the map.
 */
var Sync = {
    /**
     * Binds all sync opcodes to this class so we can handle it.
     */
    init: function () {
        Router.register(Opcodes.ENTITY_ADD, this.handleEntityAdd.bind(this));
        Router.register(Opcodes.ENTITY_LIST, this.handleEntityList.bind(this));
        Router.register(Opcodes.ENTITY_REMOVE, this.handleEntityRemove.bind(this));
        //Router.register(Opcodes.ENTITY_TELEPORT, this.handleEntityTeleport.bind(this));
    },

    /**
     * Creates, or updates, an entity based on data received from the server.
     *
     * @param e The entity to mutate. Set to NULL to create a brand new entity.
     * @param remoteData The remote description / state of the entity.
     */
    configureEntity: function (e, remoteData) {
        var isNew = false;

        if (e == null) {
            e = new Entity();
            isNew = true;
        }

        e.id = remoteData.id;
        e.remoteUid = remoteData.uid;
        e.isPlayer = remoteData.ip == 1;
        e.isCharacter = e.isPlayer;
        e.causesCollision = true;
        e.receivesCollision = true;
        e.posX = remoteData.pX;
        e.posY = remoteData.pY;

        if (isNew) {
            Game.map.add(e);
        }
    },

    /**
     * Adds one new entity to the map.
     *
     * @param data Remote payload
     */
    handleEntityAdd: function (data) {
        if (Game.map == null || Game.loading) {
            return;
        }

        this.configureEntity(null, data.e);
    },

    /**
     * Removes one entity from the map based on ID.
     *
     * @param data Remote payload
     */
    handleEntityRemove: function (data) {
        if (Game.map == null || Game.loading) {
            return;
        }

        var entity = Game.map.getEntityById(data.i);

        if (entity != null) {
            Game.map.remove(entity);
        }
    },

    /**
     * Resets the entire map and configures ALL entities.
     *
     * @param data Remote payload
     */
    handleEntityList: function (data) {
        if (Game.map == null) {
            return;
        }

        Game.map.clear();

        for (var i = 0; i < data.e.length; i++) {
            this.configureEntity(null, data.e[i]);
        }
    }
};