import targetCircle from "../../misc/targetCircle";
import utils from "../../../../utils";
const snapToTileCenter = utils.snapToTileCenter;
import { player } from "../player";
function createHandlers() {
  const myLevel = player.getLevel();
  function handleKeyPress({ speed, dir, key }) {
    myLevel.invalidateNavigationMap();
    const [TILE_WIDTH, TILE_HEIGHT] = [
      myLevel.tileWidth(),
      myLevel.tileHeight(),
    ];
    const currentTile = player.tilePos;
    const currentPos = myLevel.tile2Pos(currentTile);
    const targetPos = [
      currentPos.x + TILE_WIDTH / 2,
      currentPos.y + TILE_HEIGHT / 2,
    ];
    [0, 0].forEach((e, i) => (dir[i] = e));
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
          [speed, 0].forEach((e, i) => (dir[i] = e));
          player.play("right");
          break;
        }
        case "left": {
          [-speed, 0].forEach((e, i) => (dir[i] = e));
          player.play("left");
          break;
        }
        case "up": {
          [0, -speed].forEach((e, i) => (dir[i] = e));
          player.play("up");
          break;
        }
        case "down": {
          [0, speed].forEach((e, i) => (dir[i] = e));
          player.play("down");
          break;
        }
        default: {
          break;
        }
      }
      adjustPos.cancel();
    });
  }
  function handleTargetReached() {
    targetCircle.destroy();
  }
  function handleClick(dir) {
    const level = myLevel;
    const position = mousePos();
    const tilePos = level.pos2Tile(position);
    if (
      tilePos.x >= level.numColumns() ||
      tilePos.y >= level.numRows() ||
      tilePos.x < 0 ||
      tilePos.y < 0
    ) {
      return;
    }
    myLevel.invalidateNavigationMap();
    targetCircle.destroy();
    targetCircle.set(level, position);
    Object.assign(dir, [0, 0]);
    if (player.has("body")) {
      player.unuse("body");
    }
    player.setTarget(snapToTileCenter({ level, position }));
  }
  function handleUpdate(dir) {
    player.move(...dir);
  }
  return { handleKeyPress, handleTargetReached, handleClick, handleUpdate };
}
export default createHandlers;
