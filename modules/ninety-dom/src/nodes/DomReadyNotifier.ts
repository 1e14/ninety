import {createNode, Node} from "1e14";

export type In = {};

export type Out = {
  ev_ready: any;
};

export type DomReadyNotifier = Node<In, Out>;

export function createDomReadyNotifier(): DomReadyNotifier {
  return createNode<In, Out>(["ev_ready"], (outputs) => {
    document.addEventListener("DOMContentLoaded", () => {
      outputs.ev_ready(null, "DomReady");
    });

    return {};
  });
}
