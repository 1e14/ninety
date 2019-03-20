import {createNode, Node} from "river-core";
import Timer = NodeJS.Timer;

export type In = {
  st_active: boolean;
};

export type Out = {
  ev_tick: any;
};

// TODO: Move to river?
export type Ticker = Node<In, Out>;

export function createTicker(ms: number, active: boolean = false): Ticker {
  let timer: Timer;
  return createNode<In, Out>(["ev_tick"], (outputs) => ({
    st_active: (value) => {
      if (!active && value) {
        timer = setInterval(outputs.ev_tick, ms);
        active = true;
      } else if (active && !value) {
        clearInterval(timer);
        active = false;
      }
    }
  }));
}
