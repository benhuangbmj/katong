import loadAllSprites from "./loadSprite";
import utils from "/src/utils.js";
export default function gensomeAcademy({ TILE_WIDTH, TILE_HEIGHT }) {
  loadAllSprites();
  const levelMap = [
    "----------------",
    "|              |",
    "|              |",
    "|              |",
    "|              |",
    "|              |",
    "|              |",
    "|               ",
    "|              |",
    "|              |",
    "|              |",
    "|              |",
    "|              |",
    "----------------",
  ];
  const myLevel = level(levelMap, {
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
      " ": () => [sprite("floor"), scale(4)],
    },
  });
  onAdd("gensome-academy", (myLevel) => {
    myLevel.spawn(
      [
        sprite("card-table", { frame: 2, width: TILE_WIDTH * 3.5 }),
        anchor("center"),
        pos(TILE_WIDTH / 2, TILE_HEIGHT / 2),
      ],
      vec2(5, 5)
    );
    const girl = myLevel.spawn(
      [
        sprite("girl", { frame: 0, width: TILE_WIDTH }),
        anchor("center"),
        pos(TILE_WIDTH / 2, TILE_HEIGHT / 2),
        agent({ speed: 300, allowDiagonals: false }),
      ],
      vec2(15, 7)
    );
    girl.play("left");
    girl.setTarget(myLevel.tile2Pos(vec2(6, 4)));
    let currDirection;
    const updateAnim = girl.onUpdate(() => {
      currDirection = utils.playDirectionAnim({
        character: girl,
        currDirection,
        eventController: updateAnim,
      });
    });
  });
  const gensomeAcadeny = add([myLevel, "gensome-academy"]);
}
