import {createNode, Node} from "1e14";
import {FlameDiff} from "flamejet";
import {applyDomDiff} from "../utils";

export type In = {
  d_diff: FlameDiff;
};

export type Out = {
  ev_done: any;
};

export type FrameRenderer = Node<In, Out>;

export function createFrameRenderer(): FrameRenderer {
  return createNode<In, Out>(["ev_done"], (outputs) => {
    let handle: number;

    return {
      d_diff: (value, tag) => {
        if (handle === undefined) {
          handle = requestAnimationFrame(() => {
            // TODO: Deal with bounced? (Or remove bounce.)
            applyDomDiff(value);
            outputs.ev_done(null, tag);
          });
        }
      }
    };
  });
}
