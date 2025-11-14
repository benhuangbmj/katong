import level1 from "./levels/level1";
import spawnPlayer from "./characters/player";
export default ({ snapToTileCenter, TILE_WIDTH, TILE_HEIGHT }) => {
  const myLevel = level1(TILE_WIDTH, TILE_HEIGHT);
  const speed = 150;
  const difficulty = 0.8;
  let dir = [0, 0];
  add([myLevel, "level1"]);
  const player = spawnPlayer({ myLevel, speed });
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
      ghost.setTarget(player.pos);
    });
  };
  let chasingPlayer = chasePlayer();
  player.onCollide("ghost", () => {
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
    const currentTile = player.tilePos;
    const currentPos = myLevel.tile2Pos(currentTile);
    const targetPos = [
      currentPos.x + TILE_WIDTH / 2,
      currentPos.y + TILE_HEIGHT / 2,
    ];
    dir = [0, 0];
    if (player.has("body")) {
      player.unuse("body");
    }
    player.setTarget(vec2(...targetPos));
    const adjustPos = player.onTargetReached(() => {
      if (!player.has("body")) {
        player.use(body());
      }
      switch (key) {
        case "right": {
          dir = [speed, 0];
          player.play("right");
          break;
        }
        case "left": {
          dir = [-speed, 0];
          player.play("left");
          break;
        }
        case "up": {
          dir = [0, -speed];
          player.play("up");
          break;
        }
        case "down": {
          dir = [0, speed];
          player.play("down");
          break;
        }
        default: {
          break;
        }
      }
      adjustPos.cancel();
    });
  });
  player.onUpdate(() => {
    player.move(...dir);
  });
  let targetCircle;
  function destroyTargetCircle() {
    if (targetCircle) {
      targetCircle.destroy();
    }
  }
  player.onTargetReached(() => {
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
    if (player.has("body")) {
      player.unuse("body");
    }
    player.setTarget(snapToTileCenter({ level: myLevel, pos: mousePos() }));
  });
};
