export default function (TILE_WIDTH, TILE_HEIGHT) {
  return level(
    [
      "===========",
      "=         =",
      "= ==== == =",
      "=      =  =",
      "= ==== == =",
      "= =       =",
      "= = == ====",
      "=         =",
      "===========",
    ],
    {
      tileWidth: TILE_WIDTH,
      tileHeight: TILE_HEIGHT,
      tiles: {
        "=": () => [
          sprite("steel"),
          area(),
          body({ isStatic: true }),
          tile({ isObstacle: true }),
        ],
        "^": () => [sprite("spike"), area()],
      },
    }
  );
}
