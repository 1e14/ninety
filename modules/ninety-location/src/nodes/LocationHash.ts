import {createNode, Node} from "flowcode";

export type In = {
  /** Location hash set by user. */
  d_val: string;

  /** Samples location hash. */
  a_smp: any;
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

      a_smp: (value, tag) => {
        outputs.d_val(location.hash, tag);
      }
    };
  });
}
