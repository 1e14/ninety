import {Any, createNode, Node} from "river-core";
import {Diff} from "../types";
import {getPathComponent} from "../utils";

export type Paths<C extends string> = Array<C>;

export type PathsByPort<P extends string, C extends string> = {
  [K in P]: Paths<C>;
};

export type PortsByPath<P extends string, C extends string> = {
  [K in C]: Array<P>
};

export type DiffsByPort<P extends string> = {
  [K in P]: Diff<Any>
};

export type In = {
  d_diff: Diff<Any>
};

export type Out<P extends string> = DiffsByPort<P>;

/**
 * Splits diffs by the values of a specified component in the diffs' paths.
 * Used for directing diffs to child components.
 */
export type DiffSplitter<P extends string, C extends string> = Node<In, Out<P>>;

export function createDiffSplitter<P extends string, C extends string>(
  pathsByPort: PathsByPort<P, C>,
  depth: number
): DiffSplitter<P, C> {
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

function invertPathsByPort<P extends string, C extends string>(
  bundles: PathsByPort<P, C>
): PortsByPath<P, C> {
  const result = <PortsByPath<P, C>>{};
  for (const port in bundles) {
    const bundle = bundles[port];
    for (const path of bundle) {
      const ports = result[path] = result[path] || [];
      ports.push(port);
    }
  }
  return result;
}
