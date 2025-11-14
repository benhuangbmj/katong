export default function spawnPlayer({ myLevel, speed }) {
  const [TILE_WIDTH, TILE_HEIGHT] = [myLevel.tileWidth(), myLevel.tileHeight()];
  return myLevel.spawn(
    [
      sprite("thief", { anim: "down" }),
      anchor("center"),
      area({ shape: new Rect(vec2(0, 0), TILE_WIDTH, TILE_HEIGHT) }),
      body(),
      pos(TILE_WIDTH / 2, TILE_HEIGHT / 2),
      agent({ speed: speed, allowDiagonals: false }),
      tile(),
      "player",
    ],
    vec2(1, 1)
  );
}
