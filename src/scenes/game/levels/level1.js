import utils from "../../../utils";
import levelUtils from "./utils";
export default function (TILE_WIDTH, TILE_HEIGHT) {
  let coinCount = 0;
  const myLevel = level(levelUtils.outputRawMaze(6), {
    tileWidth: TILE_WIDTH,
    tileHeight: TILE_HEIGHT,
    tiles: {
      "-": () => [
        sprite("steel"),
        area(),
        body({ isStatic: true }),
        tile({ isObstacle: true }),
      ],
      "|": () => [
        sprite("steel"),
        area(),
        body({ isStatic: true }),
        tile({ isObstacle: true }),
      ],
      "^": () => [sprite("spike"), area()],
    },
  });
  onAdd("level1", (myLevel) => {
    for (let i = 0; i < myLevel.numRows(); i++) {
      for (let j = 0; j < myLevel.numColumns(); j++) {
        const objs = myLevel.getAt(vec2(j, i));
        if (objs.length == 0) {
          myLevel.spawn([sprite("floor"), z(-2), scale(4)], vec2(j, i));
          if (i == 1 && j == 1) continue;
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
          coin.onCollide("player", () => {
            wait(0.25, () => {
              destroy(coin);
              coinCount--;
              if (coinCount == 0) wait(0.25, () => go("end"));
            });
          });
        }
      }
    }
  });
  const output = myLevel;
  return output;
}
