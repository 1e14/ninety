import {createNode, Node} from "river-core";
import {FlameDiff} from "../types";
import {getPathComponent} from "../utils";

export type Paths = Array<string>;

export type PathsByPort<P extends string> = {
  [K in P]: Paths;
};

export type PortsByPath<P extends string> = {
  [K: string]: Array<P>
};

export type DiffsByPort<P extends string> = {
  [K in P]: FlameDiff
};

export type In = {
  d_diff: FlameDiff
};

export type Out<P extends string> = DiffsByPort<P>;

/**
 * Splits diffs by the values of a specified component in the diffs' paths.
 * Used for directing diffs to child components.
 * @deprecated Use FlameSplitter
 */
export type DiffSplitter<P extends string> = Node<In, Out<P>>;

/**
 * @deprecated Use createFlameSplitter
 * @param pathsByPort
 * @param depth
 */
export function createDiffSplitter<P extends string>(
  pathsByPort: PathsByPort<P>,
  depth: number
): DiffSplitter<P> {
  return createNode<In, Out<P>>
  (<Array<P>>Object.keys(pathsByPort), (outputs) => {
    const portsByPath = invertPathsByPort(pathsByPort);
    return {
      d_diff: (value, tag) => {
        const diffs = <DiffsByPort<P>>{};
        const valueSet = value.set;
        for (const path in valueSet) {
          const component = getPathComponent(path, depth);
          const ports = portsByPath[component];
          for (const port of ports) {
            const diff = diffs[port] = diffs[port] || {
              del: {},
              set: {}
            };
            diff.set[path] = valueSet[path];
          }
        }
        const valueDel = value.del;
        for (const path in valueDel) {
          const component = getPathComponent(path, depth);
          const ports = portsByPath[component];
          for (const port of ports) {
            const diff = diffs[port] = diffs[port] || {
              del: {},
              set: {}
            };
            diff.del[path] = null;
          }
        }
        for (const port in diffs) {
          outputs[port](diffs[port], tag);
        }
      }
    };
  });
}

function invertPathsByPort<P extends string>(
  bundles: PathsByPort<P>
): PortsByPath<P> {
  const result = <PortsByPath<P>>{};
  for (const port in bundles) {
    const bundle = bundles[port];
    for (const path of bundle) {
      const ports = result[path] = result[path] || [];
      ports.push(port);
    }
  }
  return result;
}
