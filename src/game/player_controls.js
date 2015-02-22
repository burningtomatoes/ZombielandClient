var PlayerControls = {
    update: function () {
        var player = Session.getEntity();

        if (player == null) {
            return;
        }

        var keyLeft = Keyboard.isKeyDown(KeyCode.LEFT) || Keyboard.isKeyDown(KeyCode.A);
        var keyRight = Keyboard.isKeyDown(KeyCode.RIGHT) || Keyboard.isKeyDown(KeyCode.D);

        if (keyLeft) {
            player.rotation += 1;
        }
        if (keyRight) {
            player.rotation -= 1;
        }
    }
};