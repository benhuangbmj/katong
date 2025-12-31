import createHandlers from "./handlers/ghost";
let ghost = null;

export default function spawnGhost({ myLevel, speed, difficulty }) {
  const [TILE_WIDTH, TILE_HEIGHT] = [myLevel.tileWidth(), myLevel.tileHeight()];
  ghost = myLevel.spawn(
    [
      sprite("guardian"),
      anchor("center"),
      area({ shape: new Rect(vec2(0, 0), 0, 0) }),
      pos(TILE_WIDTH / 2, TILE_HEIGHT / 2),
      agent({ speed: speed * difficulty, allowDiagonals: false }),
      tile({ isObstacle: true }),
      "ghost",
    ],
    vec2(myLevel.numColumns() - 2, myLevel.numRows() - 2)
  );
  const handlers = createHandlers();
  const ghostUpdate = ghost.onUpdate(() => {
    handlers.handleUpdate(ghostUpdate);
  });
  return ghost;
}
export { ghost };
