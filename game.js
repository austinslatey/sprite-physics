function preload() {
  this.load.image(
    "bug1",
    "https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png"
  );
  this.load.image(
    "bug2",
    "https://content.codecademy.com/courses/learn-phaser/physics/bug_2.png"
  );
  this.load.image(
    "bug3",
    "https://content.codecademy.com/courses/learn-phaser/physics/bug_3.png"
  );
  this.load.image(
    "platform",
    "https://content.codecademy.com/courses/learn-phaser/physics/platform.png"
  );
  this.load.image(
    "codey",
    "https://content.codecademy.com/courses/learn-phaser/physics/codey.png"
  );
}

const gameState = {
  score: 0,
};

function create() {
  gameState.player = this.physics.add.sprite(225, 440, "codey").setScale(0.5);
  // Add your code below:
  const platforms = this.physics.add.staticGroup();
  platforms.create(225, 510, "platform");

  gameState.player.setCollideWorldBounds(true);
  this.physics.add.collider(gameState.player, platforms);

  // Creating cursor object
  gameState.cursors = this.input.keyboard.createCursorKeys();

  // Create Enemies
  const bugs = this.physics.add.group();
  function bugGen() {
    const xCoord = Math.random() * 450;
    bugs.create(xCoord, 10, "bug1");
  }

  // Timed events to loop enemies
  const bugGenLoop = this.time.addEvent({
    callback: bugGen,
    delay: 150,
    callbackScope: this,
    loop: true,
  });

  // Colliders for Enemies & Platforms
  this.physics.add.collider(bugs, platforms, function (bug) {
    bug.destroy();

    gameState.score += 10;
    gameState.scoreText.setText(`Score: ${gameState.score}`);
  });

  // Adding score property
  gameState.scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "15px",
    fill: "#000000",
  });

  // End the game on collision
  this.physics.add.collider(gameState.player, bugs, () => {
    bugGenLoop.destroy();
    this.physics.pause();

    this.add.text(152, 270, "Game Over", {
      fontSize: "25px",
      fill: "#000000",
    });

    this.add.text(152, 270, "Click to Restart", {
      fontSize: "25px",
      fill: "#000000",
    });

    // Reset the game
    this.input.on("pointerup", () => {
      gameState.score = 0;
      this.scene.restart();
    });
  });
}

function update() {
  // Conditionals for cursors
  if (gameState.cursors.left.isDown) {
    gameState.player.setVelocityX(-160);
  } else if (gameState.cursors.right.isDown) {
    gameState.player.setVelocityX(160);
  } else {
    gameState.player.setVelocityX(0);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 450,
  height: 500,
  backgroundColor: "b9eaff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      enableBody: true,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);
