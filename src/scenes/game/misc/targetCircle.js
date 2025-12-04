let targetCircle;

function destroy() {
  if (targetCircle) {
    targetCircle.destroy();
  }
}

function get() {
  return targetCircle;
}

function set(level, position) {
  if (arguments.length == 0) {
    targetCircle = null;
    return;
  }

  const [TILE_WIDTH, TILE_HEIGHT] = [level.tileWidth(), level.tileHeight()];
  targetCircle = level.spawn(
    [
      circle(24, { fill: false }),
      pos(TILE_WIDTH / 2, TILE_HEIGHT / 2),
      outline(4, Color.GREEN),
      animate(),
      z(-1),
    ],
    level.pos2Tile(position)
  );
  targetCircle.animate("radius", [24, 16, 24], {
    duration: 0.5,
  });
}

export default { destroy, set, get };
