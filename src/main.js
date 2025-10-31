import kaplay from "kaplay";
//import "kaplay/global"; // uncomment if you want to use without the k. prefix

kaplay({
  debugKey: "f2",
});

loadRoot("./"); // A good idea for Itch.io publishing later
loadSprite("bean", "sprites/bean.png");
loadSprite("coin", "sprites/coin.png");
loadSprite("spike", "sprites/spike.png");
loadSprite("steel", "sprites/steel.png");
loadSprite("ghosty", "sprites/ghosty.png");
scene("game", () => {
  let dir = [0, 0];
  const speed = 150;
  const difficulty = 0.8;
  const [TILE_WIDTH, TILE_HEIGHT] = [64, 64];
  let coinCount = 0;
  const myLevel = level(
    [
      "===========",
      "=         =",
      "= ==== == =",
      "=      =  =",
      "= ==== == =",
      "= =       =",
      "= = == ====",
      "=         =",
      "===========",
    ],
    {
      tileWidth: TILE_WIDTH,
      tileHeight: TILE_HEIGHT,

      tiles: {
        "=": () => [
          sprite("steel"),
          area(),
          body({ isStatic: true }),
          tile({ isObstacle: true }),
        ],
        "^": () => [sprite("spike"), area()],
      },
    }
  );
  add([myLevel]);
  const bean = myLevel.spawn(
    [
      sprite("bean"),
      anchor("center"),
      area({ shape: new Rect(vec2(0, 0), TILE_WIDTH, TILE_HEIGHT) }),
      body(),
      pos(TILE_WIDTH / 2, TILE_HEIGHT / 2),
      agent({ speed: 150, allowDiagonals: false }),
      "bean",
    ],
    vec2(1, 1)
  );
  const ghost = myLevel.spawn(
    [
      sprite("ghosty"),
      anchor("center"),
      area(),
      agent({ speed: speed * difficulty, allowDiagonals: false }),
      "ghost",
    ],
    vec2(myLevel.numColumns() - 2, myLevel.numRows() - 2)
  );
  ghost.onUpdate(() => {
    ghost.setTarget(bean.pos);
  });
  bean.onCollide("ghost", () => {
    go("lost");
  });
  onKeyPress((key) => {
    switch (key) {
      case "right": {
        dir = [speed, 0];
        break;
      }
      case "left": {
        dir = [-speed, 0];
        break;
      }
      case "up": {
        dir = [0, -speed];
        break;
      }
      case "down": {
        dir = [0, speed];
        break;
      }
      default: {
        break;
      }
    }
  });
  bean.onUpdate(() => {
    bean.move(...dir);
  });
  onClick(() => {
    bean.setTarget(mousePos());
  });
  for (let i = 0; i < myLevel.numRows(); i++) {
    for (let j = 0; j < myLevel.numColumns(); j++) {
      const objs = myLevel.getAt(vec2(j, i));
      if (objs.length == 0) {
        myLevel.spawn([sprite("coin"), area()], vec2(j, i));
        coinCount++;
        const coin = myLevel.getAt(vec2(j, i))[0];
        coin.onCollide("bean", () => {
          destroy(coin);
          coinCount--;
          if (coinCount == 0) {
            go("end");
          }
        });
      }
    }
  }
});

scene("end", () => {
  add([
    text("You Win!", { size: 128 }),
    pos(center()),
    anchor("center"),
    color("red"),
  ]);
  onKeyPress(() => {
    go("game");
  });
  onTouchEnd(() => {
    go("game");
  });
});

scene("lost", () => {
  add([
    text("You Die!", { size: 128 }),
    pos(center()),
    anchor("center"),
    color("red"),
  ]);
  onKeyPress(() => {
    go("game");
  });
  onTouchEnd(() => {
    go("game");
  });
});

scene("ready?", () => {
  add([
    text("Press a key to start a game", { size: 32 }),
    pos(center()),
    anchor("center"),
    color("blue"),
  ]);
  onKeyPress(() => {
    go("game");
  });
  onTouchEnd(() => {
    go("game");
  });
});
go("game");
