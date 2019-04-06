import {createNode, Node} from "1e14";
import {FlameDiff} from "flamejet";
import {spreadDiffDel, spreadDiffSet} from "../utils";

export type In = {
  d_view: FlameDiff;
  ev_next: any;
};

export type Out = {
  d_frame: FlameDiff;
  d_length: number;
  ev_load: any;
};

export type FrameQueue = Node<In, Out>;

export function createFrameQueue(frameSize: number): FrameQueue {
  return createNode<In, Out>
  (["d_frame", "d_length", "ev_load"], (outputs) => {
    const frames = [];
    let lastSize = 0;

    return {
      d_view: (value, tag) => {
        const lengthBefore = frames.length;
        lastSize = spreadDiffDel(frames, frameSize, value.del, lastSize);
        lastSize = spreadDiffSet(frames, frameSize, value.set, lastSize);
        const lengthAfter = frames.length;
        outputs.d_length(lengthAfter, tag);
        if (!lengthBefore && lengthAfter) {
          outputs.ev_load(null, tag);
        }
      },

      ev_next: (value, tag) => {
        const frame = frames.length ?
          frames.shift() :
          null;
        outputs.d_frame(frame, tag);
        outputs.d_length(frames.length, tag);
      }
    };
  });
}
