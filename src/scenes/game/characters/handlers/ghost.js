import { ghost } from "../ghost";
import utils from "../../../../utils";
let currDirection;
function createHandlers() {
  function handleUpdate(eventController) {
    if (ghost.pos != null && ghost.getNextLocation() != null)
      currDirection = utils.playDirectionAnim({
        character: ghost,
        currDirection,
        eventController,
      });
  }
  return {
    handleUpdate,
  };
}
export default createHandlers;
