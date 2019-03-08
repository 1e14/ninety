import {createNode, Node} from "river-core";

export type In = {
  d_path: string;
};

export type Out = {
  [path: string]: Array<any>;
};

export type Router = Node<In, Out>;

const slice = Array.prototype.slice;

export function createRouter<R extends Array<RegExp>>(routes: R): Router {
  const paths = routes.map((route) => `r_${route}`);
  return createNode<In, Out>(paths, (outputs) => {
    return {
      d_path: (value, tag) => {
        for (const [idx, route] of routes.entries()) {
          const hits = route.exec(value);
          if (hits) {
            outputs[paths[idx]](slice.call(hits, 1), tag);
            break;
          }
        }
      }
    };
  });
}
