import {Diff} from "gravel-core";
import {createNode, Node} from "river-core";
import {DomEventType} from "../types";

export type In = {
  ev_event: Event;
  ev_smp: any;
};

export type Out = {
  ev_event: Event;
  d_diff: Diff<{
    [key in DomEventType]: (event: Event) => void;
  }>
};

export type EventListener = Node<In, Out>;

export function createEventListener(type: DomEventType): EventListener {
  return createNode<In, Out>(["ev_event"], (outputs) => {
    const i = {
      ev_event: (event) => {
        event.stopImmediatePropagation();
        outputs.ev_event(event);
      },

      ev_smp: (value, tag) => {
        outputs.d_diff({
          set: {
            [type]: i.ev_event
          }
        }, tag);
      }
    };
    return i;
  });
}
