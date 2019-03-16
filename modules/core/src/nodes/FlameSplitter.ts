import {createNode, Node} from "river-core";
import {Flames} from "../types";
import {getPathComponent} from "../utils";

export type Components = Array<string>;

export type ComponentsByPort<P extends string> = {
  [K in P]: Components;
};

export type PortsByComponent<P extends string> = {
  [K: string]: Array<P>
};

export type FlamesByPort<P extends string> = {
  [K in P]: Flames
};

export type In = {
  d_flames: Flames
};

export type Out<P extends string> = FlamesByPort<P>;

/**
 * Splits diffs by the values of a specified component in the diffs' paths.
 * Used for directing diffs to child components.
 */
export type FlameSplitter<P extends string> = Node<In, Out<P>>;

export function createFlameSplitter<P extends string>(
  pathsByPort: ComponentsByPort<P>,
  depth: number
): FlameSplitter<P> {
  return createNode<In, Out<P>>
  (<Array<P>>Object.keys(pathsByPort), (outputs) => {
    const portsByComponent = invertPathsByComponent(pathsByPort);
    return {
      d_flames: (value, tag) => {
        // flames, split by path component
        const split = <FlamesByPort<P>>{};
        // first, going through all the flames (branches)
        for (const name in value) {
          const branch = value[name];
          // then looking at each path in the flame
          for (const path in branch) {
            const component = getPathComponent(path, depth);
            const ports = portsByComponent[component];
            // then going through ports that match the components
            // and distributing path-value pairs to the corresponding port
            if (ports) {
              for (const port of ports) {
                const flames = split[port] = split[port] || {};
                const flame = flames[name] = flames[name] || {};
                flame[path] = branch[path];
              }
            }
          }
        }
        // emitting split flames
        for (const port in split) {
          outputs[port](split[port], tag);
        }
      }
    };
  });
}

function invertPathsByComponent<P extends string>(
  bundles: ComponentsByPort<P>
): PortsByComponent<P> {
  const result = <PortsByComponent<P>>{};
  for (const port in bundles) {
    const bundle = bundles[port];
    for (const path of bundle) {
      const ports = result[path] = result[path] || [];
      ports.push(port);
    }
  }
  return result;
}
