import {createNode, Node} from "river-core";
import {FlameDiff} from "../types";
import {getPathComponent} from "../utils";

export type Components = Array<string>;

export type ComponentsByPort<P extends string> = {
  [K in P]: Components;
};

export type PortsByComponent<P extends string> = {
  [K: string]: Array<P>
};

export type FlamesByPort<P extends string> = {
  [K in P]: FlameDiff
};

export type In = {
  d_diff: FlameDiff
};

export type Out<P extends string> = FlamesByPort<P>;

/**
 * Splits diffs by the values of a specified component in the diffs' paths.
 * Used for directing diffs to child components.
 */
export type FlameDiffSplitter<P extends string> = Node<In, Out<P>>;

export function createFlameDiffSplitter<P extends string>(
  pathsByPort: ComponentsByPort<P>,
  depth: number
): FlameDiffSplitter<P> {
  return createNode<In, Out<P>>
  (<Array<P>>Object.keys(pathsByPort), (outputs) => {
    const portsByComponent = invertPathsByComponent(pathsByPort);
    return {
      d_diff: (value, tag) => {
        // flames, split by path component
        const split = <FlamesByPort<P>>{};
        const valueSet = value.set;
        const valueDel = value.del;
        for (const path in valueSet) {
          const component = getPathComponent(path, depth);
          const ports = portsByComponent[component];
          if (ports) {
            for (const port of ports) {
              const diff = split[port] = split[port] || {set: {}, del: {}};
              diff.set[path] = valueSet[path];
            }
          }
        }
        for (const path in valueDel) {
          const component = getPathComponent(path, depth);
          const ports = portsByComponent[component];
          if (ports) {
            for (const port of ports) {
              const diff = split[port] = split[port] || {set: {}, del: {}};
              diff.del[path] = null;
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
