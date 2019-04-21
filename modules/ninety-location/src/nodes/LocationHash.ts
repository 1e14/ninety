import {createNode, Node} from "1e14";

export type In = {
  /** Location hash set by user. */
  d_val: string;

  /** Sampling signal */
  ev_smp: any;
};

export type Out = {
  /** Sampled location hash */
  d_val: string;
};

/**
 * Controls and listens to browser location hash.
 */
export type LocationHash = Node<In, Out>;

let counter: number = 0;

/**
 * Creates a LocationHash node.
 */
export function createLocationHash(): LocationHash {
  return createNode<In, Out>(["d_val"], (outputs) => {
    document.addEventListener("DOMContentLoaded", () => {
      outputs.d_val(location.hash, `LocationHash-${counter++}`);
    });

    window.addEventListener("hashchange", () => {
      outputs.d_val(location.hash, `LocationHash-${counter++}`);
    });

    return {
      d_val: (value) => {
        location.hash = value;
      },

      ev_smp: (value, tag) => {
        outputs.d_val(location.hash, tag);
      }
    };
  });
}
