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
function adjust(obj, cb = () => {}) {
  const currentTile = obj.tilePos;
  const currentPos = myLevel.tile2Pos(currentTile);
  const targetPos = [
    currentPos.x + TILE_WIDTH / 2,
    currentPos.y + TILE_HEIGHT / 2,
  ];
  obj.unuse("body");
  obj.setTarget(vec2(...targetPos));
  obj.onTargetReached(() => {
    obj.use(body());
    cb();
  });
}

export default { snapToTileCenter, chase, adjust };
