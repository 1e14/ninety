import {createNode, Node} from "1e14";
import {ComponentsByPort, Flame} from "../types";
import {getPathComponent, invertComponentsByPort} from "../utils";

/**
 * Lookup of flames indexed by port name.
 */
export type FlamesByPort<P extends string> = {
  [K in P]: Flame
};

export type In = {
  /** Flame to be split. */
  d_val: Flame;
};

export type Out<P extends string> = FlamesByPort<P>;

/**
 * Splits flames by path component at given depth.
 * TODO: Allow sub-path at depth rather than single component.
 */
export type FlameSplitter<P extends string> = Node<In, Out<P>>;

/**
 * Creates a FlameSplitter node.
 * @param componentsByPort
 * @param depth
 */
export function createFlameSplitter<P extends string>(
  componentsByPort: ComponentsByPort<P>,
  depth: number
): FlameSplitter<P> {
  const portsByComponent = invertComponentsByPort(componentsByPort);
  return createNode<In, Out<P>>
  (<Array<P>>Object.keys(componentsByPort), (outputs) => ({
    d_val: (value, tag) => {
      // flame, split by path component
      const split = <FlamesByPort<P>>{};
      for (const path in value) {
        // acquiring port(s) associated with component
        const component = getPathComponent(path, depth);
        const ports = portsByComponent[component];
        if (ports) {
          // preparing to output path on associated port
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
