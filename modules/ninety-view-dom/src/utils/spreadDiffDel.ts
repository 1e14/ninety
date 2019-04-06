import {FlameDiff, NullFlame} from "flamejet";

/**
 * Spreads diff.del across scheduled frames.
 * @param diffDel
 * @param frames
 * @param frameSize
 * @param lastSize
 */
export function spreadDiffDel(
  frames: Array<FlameDiff>,
  frameSize: number,
  diffDel: NullFlame,
  lastSize: number
): number {
  let applied = false;
  for (const path in diffDel) {
    const length = frames.length;
    // distributing path across existing frames
    for (let i = 0; i < length; i++) {
      const frame = frames[i];
      const frameSet = frame.set;
      const frameDel = frame.del;
      if (path in frameSet) {
        delete frameSet[path];
        applied = true;
        break;
      } else if (path in frameDel) {
        frameDel[path] = null;
        applied = true;
        break;
      }
    }

    if (!applied) {
      let frame = frames[length - 1];
      let frameSet = frame && frame.set;
      let frameDel = frame && frame.del;
      if (frameSet && path in frameSet) {
        delete frameSet[path];
        lastSize--;
      } else if (frameDel && lastSize < frameSize) {
        // there is room in latest frame
        frameDel[path] = null;
        lastSize++;
      } else {
        // must open new frame
        frameSet = {};
        frameDel = {};
        frame = {set: frameSet, del: frameDel};
        frames.push(frame);
        frameDel[path] = null;
        lastSize = 1;
      }
    }
  }
  return lastSize;
}
