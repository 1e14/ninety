import {Flame} from "flamejet";
import {Frame} from "../types";

/**
 * Spreads diff.set across scheduled frames.
 * @param setFlame 'Set' flame to be distributed over frames.
 * @param frames Frames over which to distribute flame.
 * @param frameSize Maximum size of each frame, adding up items in del & set
 * flames.
 * @returns Size of last, incomplete frame after spreading flame.
 * TODO: Add tests.
 */
export function spreadSetFlame(
  frames: Array<Frame>,
  frameSize: number,
  setFlame: Flame
): void {
  // walking though all path/value pairs in flame
  for (const path in setFlame) {
    // distributing path/value across existing, complete frames
    const length = frames.length;
    let found = false;
    for (let i = 0; i < length; i++) {
      const frame = frames[i];
      const frameSet = frame.set;
      const frameDel = frame.del;
      if (path in frameDel) {
        // path found in one of the frames
        // removing path and moving on
        delete frameDel[path];
        frame.size--;
        found = true;
        break;
      } else if (path in frameSet) {
        // path found in one of the frames
        // setting value and moving on
        frameSet[path] = setFlame[path];
        found = true;
        break;
      }
    }

    if (!found) {
      // looking for room in existing frames
      for (let i = 0; i < length; i++) {
        const frame = frames[i];
        if (frame.size < frameSize) {
          // frame with room left found
          // adding path and moving on
          frame.set[path] = setFlame[path];
          frame.size++;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      // path not found in any of the complete frames
      // adding frame with path/value
      frames.push({
        del: {},
        set: {
          [path]: setFlame[path]
        },
        size: 1
      });
    }
  }
}
