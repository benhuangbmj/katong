import level1 from "./levels/level1";
export default ({ snapToTileCenter, TILE_WIDTH, TILE_HEIGHT }) => {
  const myLevel = level1(TILE_WIDTH, TILE_HEIGHT);
  const speed = 150;
  const difficulty = 0.8;
  let dir = [0, 0];
  let coinCount = 0;
  add([myLevel]);
  const bean = myLevel.spawn(
    [
      sprite("thief", { anim: "down" }),
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
      area({ shape: new Rect(vec2(0, 0), 0, 0) }),
      pos(TILE_WIDTH / 2, TILE_HEIGHT / 2),
      agent({ speed: speed * difficulty, allowDiagonals: false }),
      tile({ isObstacle: true }),
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
    destroyTargetCircle();
    myLevel.invalidateNavigationMap();
    const currentTile = bean.tilePos;
    const currentPos = myLevel.tile2Pos(currentTile);
    const targetPos = [
      currentPos.x + TILE_WIDTH / 2,
      currentPos.y + TILE_HEIGHT / 2,
    ];
    dir = [0, 0];
    if (bean.has("body")) {
      bean.unuse("body");
    }
    bean.setTarget(vec2(...targetPos));
    const adjustPos = bean.onTargetReached(() => {
      if (!bean.has("body")) {
        bean.use(body());
      }
      switch (key) {
        case "right": {
          dir = [speed, 0];
          bean.play("right");
          break;
        }
        case "left": {
          dir = [-speed, 0];
          bean.play("left");
          break;
        }
        case "up": {
          dir = [0, -speed];
          bean.play("up");
          break;
        }
        case "down": {
          dir = [0, speed];
          bean.play("down");
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
  let targetCircle;
  function destroyTargetCircle() {
    if (targetCircle) {
      targetCircle.destroy();
    }
  }
  bean.onTargetReached(() => {
    if (targetCircle) {
      targetCircle.destroy();
    }
  });
  onClick(() => {
    if (targetCircle) {
      targetCircle.destroy();
    }
    targetCircle = myLevel.spawn(
      [
        circle(24, { fill: false }),
        pos(TILE_WIDTH / 2, TILE_HEIGHT / 2),
        outline(4, Color.GREEN),
        animate(),
        z(-1),
      ],
      myLevel.pos2Tile(mousePos())
    );
    targetCircle.animate("radius", [24, 16, 24], {
      duration: 0.5,
    });
    myLevel.invalidateNavigationMap();
    dir = [0, 0];
    if (bean.has("body")) {
      bean.unuse("body");
    }
    bean.setTarget(snapToTileCenter({ level: myLevel, pos: mousePos() }));
  });
  for (let i = 0; i < myLevel.numRows(); i++) {
    for (let j = 0; j < myLevel.numColumns(); j++) {
      const objs = myLevel.getAt(vec2(j, i));
      if (objs.length == 0) {
        const coin = myLevel.spawn(
          [
            sprite("coin", { anim: "shine" }),
            area(),
            anchor("center"),
            pos(TILE_WIDTH / 2, TILE_HEIGHT / 2),
            z(-1),
          ],
          vec2(j, i)
        );
        coinCount++;
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
};
