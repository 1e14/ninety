import {NullFlame} from "flamejet";
import {Frame} from "../types";

/**
 * Spreads diff.del across frames.
 * @param delFlame 'Delete' flame to be distributed over frames.
 * @param frames Frames over which to distribute flame.
 * @param frameSize Maximum size of each frame, adding up items in del & set
 * flames.
 * @returns Size of last, incomplete frame after spreading flame.
 * TODO: Add tests.
 */
export function spreadDelFlame(
  frames: Array<Frame>,
  frameSize: number,
  delFlame: NullFlame
): void {
  // walking though all paths in flame
  for (const path in delFlame) {
    // distributing path across existing, complete frames
    const length = frames.length;
    let found = false;
    for (let i = 0; i < length; i++) {
      const frame = frames[i];
      const frameSet = frame.set;
      const frameDel = frame.del;
      if (path in frameSet) {
        // path found in one of the frames
        // removing path and moving on
        delete frameSet[path];
        frame.size--;
        found = true;
        break;
      } else if (path in frameDel) {
        // path found in one of the frames
        // moving on
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
          frame.del[path] = null;
          frame.size++;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      // path could not be applied to existing frames
      // adding frame with path
      frames.push({
        del: {
          [path]: null
        },
        set: {},
        size: 1
      });
    }
  }
}
