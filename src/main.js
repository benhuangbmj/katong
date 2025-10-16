import kaplay from "kaplay";
//import "kaplay/global"; // uncomment if you want to use without the k. prefix

kaplay();

loadRoot("./"); // A good idea for Itch.io publishing later
loadSprite("bean", "sprites/bean.png");
loadSprite("coin", "sprites/coin.png");
loadSprite("spike", "sprites/spike.png");
loadSprite("steel", "sprites/steel.png");

const myLevel = level(
  [
    "===========",
    "=         =",
    "=         =",
    "=====     =",
    "=   =     =",
    "=   =  =  =",
    "=      =  =",
    "=      ====",
    "=         =",
    "===========",
  ],
  {
    tileWidth: 64,
    tileHeight: 64,

    tiles: {
      "=": () => [
        sprite("steel"),
        area(),
        body({ isStatic: true }),
        tile({ isObstacle: true }),
      ],
      $: () => [sprite("coin"), area(), pos(0, -9)],
      "^": () => [sprite("spike"), area(), "danger"],
    },
  }
);
add([myLevel]);
const bean = myLevel.spawn(
  [
    sprite("bean"),
    anchor("center"),
    pos(64, 64),
    tile(),
    agent({ agentSpeed: 640, allowDiagonals: true }),
    "bean",
  ],
  vec2(1, 1)
);
onClick(() => {
  bean.setTarget(mousePos());
});
