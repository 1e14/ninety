import {createNode, Node} from "1e14";
import {Frame} from "../types";
import {applyDomDiff} from "../utils";

export type In = {
  /**
   * Frame to be rendered.
   */
  d_frame: Frame;
};

export type Out = {
  /**
   * Signals end of rendering, with duration in [ms].
   */
  d_dur: DOMHighResTimeStamp;
};

/**
 * Renders individual frames.
 */
export type FrameRenderer = Node<In, Out>;

/**
 * Creates a FrameRenderer node.
 */
export function createFrameRenderer(): FrameRenderer {
  return createNode<In, Out>(["d_dur"], (outputs) => {
    return {
      d_frame: (value, tag) => {
        requestAnimationFrame(() => {
          const startAt = performance.now();
          applyDomDiff(value);
          const finishAt = performance.now();
          outputs.d_dur(finishAt - startAt, tag);
        });
      }
    };
  });
}
