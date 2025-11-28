import level1 from "./levels/level1";
import spawnPlayer from "./characters/player";
import spawnGhost from "./characters/ghost";
import utils from "../../utils";
export default ({ TILE_WIDTH, TILE_HEIGHT, logo }) => {
  const myLevel = level1(TILE_WIDTH, TILE_HEIGHT);
  const speed = 150;
  const difficulty = 0.8;
  const level = add([myLevel, pos(0, (logo.height * 2) / 3), "level1"]);
  level.pos = vec2((width() - level.levelWidth()) / 2, (logo.height * 2) / 3);

  const player = spawnPlayer({ myLevel, speed });
  const ghost = spawnGhost({ myLevel, speed, difficulty });
  utils.chase(ghost, player);
};
