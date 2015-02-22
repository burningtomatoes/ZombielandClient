var PlayerControls = {
    update: function () {
        var player = Session.getEntity();

        if (player == null) {
            return;
        }

        var keyLeft = Keyboard.isKeyDown(KeyCode.LEFT) || Keyboard.isKeyDown(KeyCode.A);
        var keyRight = Keyboard.isKeyDown(KeyCode.RIGHT) || Keyboard.isKeyDown(KeyCode.D);
        var keyForward = Keyboard.isKeyDown(KeyCode.UP) || Keyboard.isKeyDown(KeyCode.W);
        var keyBackward = Keyboard.isKeyDown(KeyCode.DOWN) || Keyboard.isKeyDown(KeyCode.S);

        if (keyLeft) {
            player.rotation -= player.speedRotate;
        }
        if (keyRight) {
            player.rotation += player.speedRotate;
        }

        if (keyForward) {
            player.moving = true;
        } else {
            player.moving = false;
        }
    }
};