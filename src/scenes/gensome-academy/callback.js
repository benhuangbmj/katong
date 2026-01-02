import loadAllSprites from "./loadSprite";
import utils from "/src/utils.js";
export default function gensomeAcademy({ TILE_WIDTH, TILE_HEIGHT }) {
  const BAR_WIDTH = 240;
  const BAR_HEIGHT = 28;
  const OUTLINE = 4;
  const DURATION = 5;
  const barPos = vec2((width() - BAR_WIDTH) / 2, 200);

  const outerBar = add([
    rect(BAR_WIDTH, BAR_HEIGHT),
    pos(barPos),
    color(160, 160, 160),
    outline(OUTLINE, rgb(0, 0, 0)),
    anchor("left"),
    fixed(),
  ]);

  const innerBar = add([
    rect(1, BAR_HEIGHT - OUTLINE),
    pos(barPos.add(vec2(OUTLINE / 2, 0))),
    color(0, 255, 100),
    anchor("left"),
    fixed(),
    z(outerBar.z + 1),
  ]);

  let elapsed = 0;
  const progress = onUpdate(() => {
    debug.log(time());
    elapsed = Math.min(elapsed + dt(), DURATION);
    const fillRatio = elapsed / DURATION;
    innerBar.width = (BAR_WIDTH - OUTLINE) * fillRatio;
    if (elapsed >= DURATION) {
      progress.cancel();
    }
  });
}
