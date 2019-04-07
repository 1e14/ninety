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
      // path not found in any of the complete frames
      // looking in last, incomplete frame
      let frame = frames[length - 1];
      let frameSet = frame && frame.set;
      let frameDel = frame && frame.del;
      if (frameDel && path in frameDel) {
        // path found in last frame
        // removing and updating size
        delete frameDel[path];
        frame.size--;
      } else if (frameSet && frame.size < frameSize) {
        // path not found in last frame but there is room left
        // setting path/value pair and updating size
        frameSet[path] = setFlame[path];
        frame.size++;
      } else {
        // path not found in last frame but last frame is full
        // adding frame with path/value
        frameSet = {
          [path]: setFlame[path]
        };
        frameDel = {};
        frame = {set: frameSet, del: frameDel, size: 1};
        frames.push(frame);
      }
    }
  }
}
