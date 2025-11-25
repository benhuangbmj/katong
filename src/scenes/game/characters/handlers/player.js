import targetCircle from "../../misc/targetCircle";
import utils from "../../../../utils";
const snapToTileCenter = utils.snapToTileCenter;
import { player } from "../player";
function createHandlers() {
  targetCircle.set(); //reset the target circle when entering a new game
  const myLevel = player.getLevel();
  function handleKeyPress({ speed, dir, key }) {
    let nextDir;
    switch (key) {
      case "right": {
        nextDir = [speed, 0];
        break;
      }
      case "left": {
        nextDir = [-speed, 0];
        break;
      }
      case "up": {
        nextDir = [0, -speed];
        break;
      }
      case "down": {
        nextDir = [0, speed];
        break;
      }
      default: {
        return;
      }
    }
    if (JSON.stringify(nextDir) === JSON.stringify(dir)) return;
    Object.assign(dir, [0, 0]);
    function changeDir() {
      Object.assign(dir, nextDir);
      player.play(key);
    }
    utils.adjustPosition(player, changeDir);
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
  let currDirection;
  function handleUpdate(dir) {
    if (dir.some((e) => e !== 0)) player.move(...dir);
    else if (player.pos != null && player.getNextLocation() != null)
      currDirection = utils.playDirectionAnim({
        character: player,
        currDirection,
        currPosition: player.pos,
        nextPosition: player.getNextLocation(),
      });
  }
  return { handleKeyPress, handleTargetReached, handleClick, handleUpdate };
}
export default createHandlers;
