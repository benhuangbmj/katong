import kaplay from "kaplay";
//import "kaplay/global"; // uncomment if you want to use without the k. prefix

kaplay();

loadRoot("./"); // A good idea for Itch.io publishing later
loadSprite("bean", "sprites/bean.png");
loadSprite("coin", "sprites/coin.png");
loadSprite("spike", "sprites/spike.png");
loadSprite("steel", "sprites/steel.png");
loadSprite("ghosty", "sprites/ghosty.png");
scene("game", () => {
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
      area(),
      pos(32, 32),
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
      pos(32, 32),
      agent({ speed: 100, allowDiagonals: false }),
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
go("ready?");
