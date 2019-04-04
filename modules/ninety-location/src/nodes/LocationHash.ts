import {createNode, Node} from "1e14";

export type In = {
  d_val: string;
  ev_smp: any;
};

export type Out = {
  d_val: string;
};

export type LocationHash = Node<In, Out>;

let counter: number = 0;

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
