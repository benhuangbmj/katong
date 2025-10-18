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
    "= ==== == =",
    "=      =  =",
    "= ==== == =",
    "= =       =",
    "= = == ====",
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
      "^": () => [sprite("spike"), area()],
    },
  }
);
add([myLevel]);
const bean = myLevel.spawn(
  [
    sprite("bean"),
    anchor("center"),
    pos(32, 32),
    tile(),
    agent({ speed: 320, allowDiagonals: false }),
    "bean",
  ],
  vec2(1, 1)
);
onClick(() => {
  bean.setTarget(mousePos());
});
for (let i = 0; i < myLevel.numRows(); i++) {
  for (let j = 0; j < myLevel.numColumns(); j++) {
    const objs = myLevel.getAt(vec2(j, i));
    if (objs.length == 0) {
      myLevel.spawn([sprite("coin")], vec2(j, i));
    }
  }
}
