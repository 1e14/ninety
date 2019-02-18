import {createOutPorts, createOutputs, InPorts, Node} from "river-core";

export type Inputs = {
  d_path: string;
};

export type Outputs = {
  [path: string]: Array<any>;
};

export type Router = Node<Inputs, Outputs>;

const slice = Array.prototype.slice;

export function createRouter<R extends Array<RegExp>>(routes: R): Router {
  const paths = routes.map(String);
  const o = createOutPorts(paths);
  const outputs = createOutputs(o);

  const i: InPorts<Inputs> = {
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

  return {i, o};
}
