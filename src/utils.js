function snapToTileCenter({ level, pos }) {
  const tilePos = level.pos2Tile(pos);
  const tileWorldPos = level.tile2Pos(tilePos);
  const output = vec2(
    tileWorldPos.x + 0.5 * level.tileWidth(),
    tileWorldPos.y + 0.5 * level.tileHeight()
  );
  return output;
}

export default { snapToTileCenter };
