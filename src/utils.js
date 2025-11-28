function snapToTileCenter({ level, position }) {
  const tilePos = level.pos2Tile(position);
  const tileWorldPos = level.tile2Pos(tilePos);
  const output = vec2(
    tileWorldPos.x + 0.5 * level.tileWidth(),
    tileWorldPos.y + 0.5 * level.tileHeight()
  );
  return output;
}
function chase(subject, target) {
  return subject.onUpdate(() => {
    subject.setTarget(target.pos);
  });
}
function adjustPosition(obj, cb = () => {}) {
  const currentTile = obj.tilePos;
  const myLevel = obj.getLevel();
  myLevel.invalidateNavigationMap();
  const [TILE_WIDTH, TILE_HEIGHT] = [myLevel.tileWidth(), myLevel.tileHeight()];
  const currentPos = myLevel.tile2Pos(currentTile);
  const targetPos = [
    currentPos.x + TILE_WIDTH / 2,
    currentPos.y + TILE_HEIGHT / 2,
  ];
  obj.unuse("body");
  obj.setTarget(vec2(...targetPos));
  const onAdjustFinished = obj.onTargetReached(() => {
    obj.use(body());
    cb();
    onAdjustFinished.cancel();
  });
}
function playDirectionAnim({
  character,
  currDirection,
  currPosition,
  nextPosition,
}) {
  function getDirection(currPos, nextPos) {
    const { x: currX, y: currY } = currPos;
    const { x: nextX, y: nextY } = nextPos;
    const deltaX = nextX - currX;
    const deltaY = nextY - currY;
    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      if (deltaX > 0) return "right";
      if (deltaX < 0) return "left";
    } else {
      if (deltaY > 0) return "down";
      if (deltaY < 0) return "up";
    }
    return null;
  }
  {
    const direction = getDirection(currPosition, nextPosition);
    if (direction != null && direction != currDirection) {
      character.play(direction);
      return direction;
    } else return currDirection;
  }
}
function displaySceneMessage(message) {
  const [WIDTH_OFFSET, HEIGHT_OFFSET] = [50, 125];
  const mainText = add([
    text(message, {
      width: width() * 0.8,
      size: width() > 1400 ? 128 : 64,
      align: "left",
    }),
    pos(WIDTH_OFFSET, HEIGHT_OFFSET),
    color("red"),
  ]);
  add([
    text("ENTER: Start a game    ESC: Exit to work on your math homework", {
      size: width() / 45,
      width: width(),
    }),
    pos(WIDTH_OFFSET, 1.5 * HEIGHT_OFFSET + mainText.height),
    color("blue"),
  ]);
  onKeyPress((key) => {
    switch (key) {
      case "enter":
        go("game");
        break;
      case "escape":
        quit();
        break;
    }
  });
}
function mirrorLevel(levelArr) {
  const output = levelArr.map((row) => {
    const rowArr = row.split("");
    rowArr.push(...rowArr.toReversed());
    return rowArr.join("");
  });
  output.push(...output.toReversed());
  return output;
}
export default {
  snapToTileCenter,
  chase,
  adjustPosition,
  playDirectionAnim,
  displaySceneMessage,
  mirrorLevel,
};
