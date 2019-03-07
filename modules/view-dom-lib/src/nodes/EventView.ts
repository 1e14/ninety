import {Diff, prefixDiffPaths} from "gravel-core";
import {createNode, Node} from "river-core";
import {DomEventType} from "../types";

export type DomEventHandler = (event: Event) => void;

export type DomEventHandlers = {
  [key in DomEventType]: DomEventHandler
};

export type EventViewDiff = Diff<DomEventHandlers>;

export type In<T extends Event> = {
  ev_smp: any;
};

export type Out<T extends Event> = {
  d_event: T;
  v_diff: EventViewDiff
};

export type EventView<T extends Event> = Node<In<T>, Out<T>>;

export function createEventView<T extends Event>(
  prefix: string,
  type: DomEventType
): EventView<T> {
  return createNode<In<T>, Out<T>>
  (["v_diff", "d_event"], (outputs) => {
    return {
      ev_smp: (value, tag) => {
        outputs.v_diff(prefixDiffPaths({
          del: {},
          set: {
            [type]: (event) => {
              event.stopImmediatePropagation();
              outputs.d_event(event, tag);
            }
          }
        }, prefix), tag);
      }
    };
  });
}
