import {Diff, prefixDiffPaths} from "gravel-core";
import {createNode, Node} from "river-core";
import {DomEventType} from "../types";

export type DomEventHandler = (event: Event) => void;

export type DomEventHandlers = {
  [key in DomEventType]: DomEventHandler
};

export type EventListenerDiff = Diff<DomEventHandlers>;

export type In<T extends Event> = {
  d_event: T;
  ev_smp: any;
};

export type Out<T extends Event> = {
  d_event: T;
  d_diff: EventListenerDiff
};

export type EventListener<T extends Event> = Node<In<T>, Out<T>>;

export function createEventListener<T extends Event>(prefix: string, type: DomEventType): EventListener<T> {
  return createNode<In<T>, Out<T>>(["d_diff", "d_event"], (outputs) => {
    const i = {
      d_event: (event, tag) => {
        event.stopImmediatePropagation();
        outputs.d_event(event, tag);
      },

      ev_smp: (value, tag) => {
        outputs.d_diff(prefixDiffPaths({
          set: {
            [type]: i.d_event
          }
        }, prefix), tag);
      }
    };
    return i;
  });
}
