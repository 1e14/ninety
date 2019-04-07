import {createNode, Node} from "1e14";
import {FlameDiff} from "flamejet";
import {applyDomDiff} from "../utils";

export type In = {
  /**
   * Frame to be rendered.
   */
  d_frame: FlameDiff;
};

export type Out = {
  /**
   * Signals end of rendering, with duration in [ms].
   */
  ev_done: DOMHighResTimeStamp;
};

/**
 * Renders individual frames.
 */
export type FrameRenderer = Node<In, Out>;

/**
 * Creates a FrameRenderer node.
 */
export function createFrameRenderer(): FrameRenderer {
  return createNode<In, Out>(["ev_done"], (outputs) => {
    return {
      d_frame: (value, tag) => {
        if (value) {
          requestAnimationFrame(() => {
            // TODO: Deal with bounced? (Or remove bounce.)
            const startAt = performance.now();
            applyDomDiff(value);
            const finishAt = performance.now();
            outputs.ev_done(finishAt - startAt, tag);
          });
        }
      }
    };
  });
}
