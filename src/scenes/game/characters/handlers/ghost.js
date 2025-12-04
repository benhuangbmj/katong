import { ghost } from "../ghost";
import utils from "../../../../utils";
let currDirection;
function createHandlers() {
  function handleUpdate() {
    if (ghost.pos != null && ghost.getNextLocation() != null)
      currDirection = utils.playDirectionAnim({
        character: ghost,
        currDirection,
        currPosition: ghost.pos,
        nextPosition: ghost.getNextLocation(),
      });
  }
  return {
    handleUpdate,
  };
}
export default createHandlers;
