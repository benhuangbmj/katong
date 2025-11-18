import kaplay from "kaplay";
import loadAllSprites from "./loadSprite";
import utils from "./utils";
import sceneGame from "./scenes/game/callback";
const snapToTileCenter = utils.snapToTileCenter;
const [TILE_WIDTH, TILE_HEIGHT] = [64, 64];
//import "kaplay/global"; // uncomment if you want to use without the k. prefix

const k = kaplay({
  debugKey: "f2",
});

loadRoot("./"); // A good idea for Itch.io publishing later

loadAllSprites();

add([sprite("kaplay-dino"), pos(width() - 210, 10), scale(0.5), stay()]);

scene("game", () => sceneGame({ snapToTileCenter, TILE_WIDTH, TILE_HEIGHT }));

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
