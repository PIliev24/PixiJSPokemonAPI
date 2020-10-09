var imageUrl = document.querySelector("#imageUrl").innerText,
  speed = document.querySelector("#speed").innerText,
  defense = document.querySelector("#defense").innerText,
  attack = document.querySelector("#attack").innerText,
  originalHp = document.querySelector("#hp").innerText,
  enemyImageUrl = document.querySelector("#enemyImageUrl").innerText,
  enemySpeed = document.querySelector("#enemySpeed").innerText,
  enemyDefense = document.querySelector("#enemyDefense").innerText,
  enemyAttack = document.querySelector("#enemyAttack").innerText,
  enemyOriginalHp = document.querySelector("#enemyHp").innerText,
  enemyHealthBar = 100,
  playerHealthBar = 100,
  app,
  reverse = true,
  attacking = false,
  player,
  enemy,
  originalEnemyX = 650,
  originalEnemyY = 200,
  originalPlayerX = 100,
  originalPlayerY = 350,
  enemyXAttack = -5,
  enemyYAttack = 1.5,
  playerXAttack = 5,
  playerYAttack = -1.5;

var playerTurn = speed >= enemySpeed ? false : true;

function loadPixiCanvas() {
  const gameDiv = document.getElementById("gameDiv");

  app = new PIXI.Application({
    width: 800,
    height: 450,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
  });
  gameDiv.appendChild(app.view);

  const container = new PIXI.Container();

  app.stage.addChild(container);

  // Create a new texture
  const texture = PIXI.Texture.from("/images/pokemonArena.png");

  // create a new Sprite using the texture
  const arena = new PIXI.Sprite(texture);

  // center the sprites anchor point
  arena.anchor.set(0.5);

  // move the sprite to the center of the screen
  arena.x = app.screen.width / 2;
  arena.y = app.screen.height / 2;

  const pokemonTexture = PIXI.Texture.from(imageUrl);
  player = new PIXI.Sprite(pokemonTexture);

  // center the sprites anchor point
  player.anchor.set(0.5);
  // move the sprite to the center of the screen
  player.x = originalPlayerX;
  player.y = originalPlayerY;
  player.width = 200;
  player.height = 200;

  const enemyTexture = new PIXI.Texture.from(enemyImageUrl);
  enemy = new PIXI.Sprite(enemyTexture);

  // center the sprites anchor point
  enemy.anchor.set(0.5);
  // move the sprite to the center of the screen
  enemy.x = originalEnemyX;
  enemy.y = originalEnemyY;
  enemy.width = 200;
  enemy.height = 200;

  app.stage.addChild(arena);
  app.stage.addChild(player);
  app.stage.addChild(enemy);
  app.loader.onComplete.add(initLevel);
  app.loader.load();
}

loadPixiCanvas();

function gameLoop(delta) {
  if (!playerTurn) {
    enemy.x += enemyXAttack;
    enemy.y += enemyYAttack;
    if (intersect(enemy, player) && reverse) {
      enemyXAttack = enemyXAttack * -1;
      enemyYAttack = enemyYAttack * -1;
      reverse = false;
    }
    if (originalEnemyX === enemy.x && originalEnemyY == enemy.y) {
      enemyXAttack = enemyXAttack * -1;
      enemyYAttack = enemyYAttack * -1;
      playerTurn = true;
      reverse = true;

      let damage = Math.floor((enemyAttack / defense) * getRandomInt(0, 200));
      let procent = 100 * (damage / originalHp);
      playerHealthBar -= procent;
      document.querySelector("#playerHealthBar").value = playerHealthBar;
    }

    if (playerHealthBar <= 0) {
      Swal.fire({
        title: "You lost!",
        text: "Better luck next time!",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Play again?",
      }).then((result) => {
        if (result.isConfirmed) {
          location.assign("/");
        }
      });

      app.ticker.stop();
    }
  }

  if (attacking === true) {
    if (playerTurn) {
      player.x += playerXAttack;
      player.y += playerYAttack;
      if (intersect(enemy, player) && reverse) {
        playerXAttack = playerXAttack * -1;
        playerYAttack = playerYAttack * -1;
        reverse = false;
      }
      if (originalPlayerX === player.x && originalPlayerY == player.y) {
        playerXAttack = playerXAttack * -1;
        playerYAttack = playerYAttack * -1;
        playerTurn = false;
        reverse = true;

        let damage = Math.floor((attack / enemyDefense) * getRandomInt(0, 200));
        let procent = 100 * (damage / enemyHealthBar);
        enemyHealthBar -= procent;
        document.querySelector("#enemyHealthBar").value = playerHealthBar;
        attacking = false;
      }
    }
  }
}

function initLevel() {
  app.ticker.add(gameLoop);
}

function intersect(a, b) {
  let aBox = a.getBounds();
  let bBox = b.getBounds();

  return (
    aBox.x + aBox.width > bBox.x &&
    aBox.x < bBox.x + bBox.width &&
    aBox.y + aBox.height > bBox.y &&
    aBox.y < bBox.height + bBox.y
  );
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const playerTurnToAttack = () => {
  attacking = true;
};
