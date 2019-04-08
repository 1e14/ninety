import {createNode, Node} from "1e14";
import {Flame, PathComponentsByPort} from "../types";
import {getPathComponent, invertComponentsByPort} from "../utils";

export type FlamesByPort<P extends string> = {
  [K in P]: Flame
};

export type In = {
  d_val: Flame;
};

export type Out<P extends string> = FlamesByPort<P>;

export type FlameSplitter<P extends string> = Node<In, Out<P>>;

export function createFlameSplitter<P extends string>(
  componentsByPort: PathComponentsByPort<P>,
  depth: number
): FlameSplitter<P> {
  const portsByComponent = invertComponentsByPort(componentsByPort);
  return createNode<In, Out<P>>
  (<Array<P>>Object.keys(componentsByPort), (outputs) => ({
    d_val: (value, tag) => {
      // flame, split by path component
      const split = <FlamesByPort<P>>{};
      for (const path in value) {
        const component = getPathComponent(path, depth);
        const ports = portsByComponent[component];
        if (ports) {
          for (const port of ports) {
            const flame = split[port] = split[port] || {};
            flame[path] = value[path];
          }
        }
      }
      // emitting split flame
      for (const port in split) {
        outputs[port](split[port], tag);
      }
    }
  }));
}
