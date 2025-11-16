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
export default { snapToTileCenter, chase, adjustPosition, playDirectionAnim };
