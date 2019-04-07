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
    const length = frames.length - 1;
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
      // path not found in any of the complete frames
      // looking in last, incomplete frame
      let frame = frames[length - 1];
      let frameSet = frame && frame.set;
      let frameDel = frame && frame.del;
      if (frameSet && path in frameSet) {
        // path found in last frame
        // removing and updating size
        delete frameSet[path];
        frame.size--;
      } else if (frameDel && frame.size < frameSize) {
        // path not found in last frame but there is room left
        // setting path and updating size
        frameDel[path] = null;
        frame.size++;
      } else {
        // path not found in last frame but last frame is full
        // adding frame with path
        frameSet = {};
        frameDel = {
          [path]: null
        };
        frame = {set: frameSet, del: frameDel, size: 1};
        frames.push(frame);
      }
    }
  }
}
