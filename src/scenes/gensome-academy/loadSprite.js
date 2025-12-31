function loadAllSprites() {
  loadSprite("card-table", "sprites/Card Table.png", {
    sliceY: 3,
  });

  // Assumes girl.png is a 4x4 sheet: rows = down, left, right, up
  loadSprite("girl", "sprites/girl.png", {
    sliceX: 4,
    sliceY: 5,
    anims: {
      down: { from: 12, to: 15, speed: 8, loop: true },
      left: { from: 8, to: 11, speed: 8, loop: true },
      right: { from: 4, to: 7, speed: 8, loop: true },
      up: { from: 16, to: 19, speed: 8, loop: true },
    },
  });
}
export default loadAllSprites;
