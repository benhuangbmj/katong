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
function snapToTileCenter({ level, pos }) {
  const tilePos = level.pos2Tile(pos);
  const tileWorldPos = level.tile2Pos(tilePos);
  const output = vec2(
    tileWorldPos.x + 0.5 * level.tileWidth(),
    tileWorldPos.y + 0.5 * level.tileHeight()
  );
  return output;
}
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
      // "===========",
      // "=         =",
      // "=         =",
      // "=         =",
      // "=         =",
      // "=         =",
      // "=         =",
      // "=         =",
      // "===========",
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
      agent({ speed: speed, allowDiagonals: false }),
      tile(),
      "bean",
    ],
    vec2(1, 1)
  );
  const ghost = myLevel.spawn(
    [
      sprite("ghosty"),
      anchor("center"),
      area({ shape: new Rect(vec2(0, 0), TILE_WIDTH, TILE_HEIGHT) }),
      pos(TILE_WIDTH / 2, TILE_HEIGHT / 2),
      agent({ speed: speed * difficulty, allowDiagonals: false }),
      "ghost",
    ],
    vec2(myLevel.numColumns() - 2, myLevel.numRows() - 2)
  );
  const chasePlayer = () => {
    return ghost.onUpdate(() => {
      ghost.setTarget(bean.pos);
    });
  };
  let chasingPlayer = chasePlayer();
  bean.onCollide("ghost", () => {
    go("lost");
  });
  function adjust(obj, cb = () => {}) {
    const currentTile = obj.tilePos;
    const currentPos = myLevel.tile2Pos(currentTile);
    const targetPos = [
      currentPos.x + TILE_WIDTH / 2,
      currentPos.y + TILE_HEIGHT / 2,
    ];
    obj.unuse("body");
    obj.setTarget(vec2(...targetPos));
    obj.onTargetReached(() => {
      obj.use(body());
      cb();
    });
  }
  onKeyPress((key) => {
    const currentTile = bean.tilePos;
    const currentPos = myLevel.tile2Pos(currentTile);
    const targetPos = [
      currentPos.x + TILE_WIDTH / 2,
      currentPos.y + TILE_HEIGHT / 2,
    ];
    dir = [0, 0];
    bean.unuse("body");
    bean.setTarget(vec2(...targetPos));
    const adjustPos = bean.onTargetReached(() => {
      bean.use(body());
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
      adjustPos.cancel();
    });
  });
  bean.onUpdate(() => {
    bean.move(...dir);
  });
  onClick(() => {
    bean.setTarget(snapToTileCenter({ level: myLevel, pos: mousePos() }));
  });
  for (let i = 0; i < myLevel.numRows(); i++) {
    for (let j = 0; j < myLevel.numColumns(); j++) {
      const objs = myLevel.getAt(vec2(j, i));
      if (objs.length == 0) {
        myLevel.spawn(
          [
            sprite("coin"),
            area(),
            anchor("center"),
            scale(1.2),
            pos(TILE_WIDTH / 2, TILE_HEIGHT / 2),
            z(-1),
          ],
          vec2(j, i)
        );
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
