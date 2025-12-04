import kaplay from "kaplay";
import loadAllSprites from "./loadSprite";
import utils from "./utils";
import sceneGame from "./scenes/game/callback";
const [TILE_WIDTH, TILE_HEIGHT] = [64, 64];
//import "kaplay/global"; // uncomment if you want to use without the k. prefix
const k = kaplay({
  debugKey: "f2",
});

loadRoot("./"); // A good idea for Itch.io publishing later

loadAllSprites();

const logo = add([
  sprite("kaplay-dino"),
  pos((width() - 210) / 2, 10),
  scale(0.5),
  stay(),
  z(-2),
]);

scene("game", () => sceneGame({ TILE_WIDTH, TILE_HEIGHT }));

scene("end", () => {
  utils.displaySceneMessage(import.meta.env.VITE_WIN_SCENE || "You Win!");
  onTouchEnd(() => {
    go("game");
  });
});

scene("lost", () => {
  utils.displaySceneMessage(import.meta.env.VITE_LOST_SCENE || "You Die!");
  onTouchEnd(() => {
    go("game");
  });
});

scene("ready?", () => {
  utils.displaySceneMessage(
    import.meta.env.VITE_READY_SCENE || "Are You Ready?"
  );
  onTouchEnd(() => {
    go("game");
  });
});
go("ready?");
