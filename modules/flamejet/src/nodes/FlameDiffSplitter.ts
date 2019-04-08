import {createNode, Node} from "1e14";
import {FlameDiff, PathComponentsByPort} from "../types";
import {getPathComponent, invertComponentsByPort} from "../utils";

export type FlameDiffsByPort<P extends string> = {
  [K in P]: FlameDiff
};

export type In = {
  d_diff: FlameDiff
};

export type Out<P extends string> = FlameDiffsByPort<P>;

/**
 * Splits diffs by the values of a specified component in the diffs' paths.
 * Used for directing diffs to child components.
 */
export type FlameDiffSplitter<P extends string> = Node<In, Out<P>>;

export function createFlameDiffSplitter<P extends string>(
  pathsByPort: PathComponentsByPort<P>,
  depth: number
): FlameDiffSplitter<P> {
  const portsByComponent = invertComponentsByPort(pathsByPort);
  return createNode<In, Out<P>>
  (<Array<P>>Object.keys(pathsByPort), (outputs) => ({
    d_diff: (value, tag) => {
      // flames, split by path component
      const split = <FlameDiffsByPort<P>>{};
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
  }));
}
