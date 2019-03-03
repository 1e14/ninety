import {Diff} from "gravel-core";
import {createNode, Node} from "river-core";
import {DomEventType} from "../types";

export type In = {
  d_event: Event;
  ev_smp: any;
};

export type Out = {
  d_event: Event;
  d_diff: Diff<{
    [key in DomEventType]: (event: Event) => void;
  }>
};

export type EventListener = Node<In, Out>;

export function createEventListener(type: DomEventType): EventListener {
  return createNode<In, Out>(["d_event"], (outputs) => {
    const i = {
      d_event: (event) => {
        event.stopImmediatePropagation();
        outputs.d_event(event);
      },

      ev_smp: (value, tag) => {
        outputs.d_diff({
          set: {
            [type]: i.d_event
          }
        }, tag);
      }
    };
    return i;
  });
}
