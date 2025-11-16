function loadAllSprites() {
  loadSprite("coin", "sprites/shining-star-coin.png", {
    sliceX: 6,
    anims: {
      shine: {
        frames: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4, 5, 3],
        speed: 24,
        loop: true,
      },
    },
  });
  loadSprite("spike", "sprites/spike.png");
  loadSprite("steel", "sprites/steel.png");
  loadSprite("thief", "sprites/thief.png", {
    sliceX: 3,
    sliceY: 4,
    anims: {
      up: { from: 0, to: 2, loop: true },
      right: { from: 3, to: 5, loop: true },
      down: { from: 6, to: 8, loop: true },
      left: { from: 9, to: 11, loop: true },
    },
  });
  loadSprite("guardian", "sprites/guardian.png", {
    sliceX: 3,
    sliceY: 4,
    anims: {
      up: { from: 0, to: 2, loop: true },
      right: { from: 3, to: 5, loop: true },
      down: { from: 6, to: 8, loop: true },
      left: { from: 9, to: 11, loop: true },
    },
  });
}
export default loadAllSprites;
