import {Flame, FlameDiff} from "flamejet";

/**
 * Spreads diff.set across scheduled frames.
 * @param diffSet
 * @param frames
 * @param frameSize
 * @param lastSize
 */
export function spreadDiffSet(
  frames: Array<FlameDiff>,
  frameSize: number,
  diffSet: Flame,
  lastSize: number
): number {
  let applied = false;
  for (const path in diffSet) {
    const length = frames.length;
    // distributing path across existing frames
    for (let i = 0; i < length; i++) {
      const frame = frames[i];
      const frameSet = frame.set;
      const frameDel = frame.del;
      if (path in frameDel) {
        delete frameDel[path];
        applied = true;
        break;
      } else if (path in frameSet) {
        frameSet[path] = diffSet[path];
        applied = true;
        break;
      }
    }

    if (!applied) {
      let frame = frames[length - 1];
      let frameSet = frame && frame.set;
      let frameDel = frame && frame.del;
      if (frameDel && path in frameDel) {
        delete frameDel[path];
        lastSize--;
      } else if (frameSet && lastSize < frameSize) {
        // there is room in latest frame
        frameSet[path] = diffSet[path];
        lastSize++;
      } else {
        // must open new frame
        frameSet = {};
        frameDel = {};
        frame = {set: frameSet, del: frameDel};
        frames.push(frame);
        frameSet[path] = diffSet[path];
        lastSize = 1;
      }
    }
  }
  return lastSize;
}
