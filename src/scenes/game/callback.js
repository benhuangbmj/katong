import level1 from "./levels/level1";
import spawnPlayer from "./characters/player";
import spawnGhost from "./characters/ghost";
import utils from "../../utils";
export default ({ TILE_WIDTH, TILE_HEIGHT }) => {
  const myLevel = level1(TILE_WIDTH, TILE_HEIGHT);
  const speed = 150;
  const difficulty = 0.8;
  add([myLevel, "level1"]);
  const player = spawnPlayer({ myLevel, speed });
  const ghost = spawnGhost({ myLevel, speed, difficulty });
  utils.chase(ghost, player);
};
