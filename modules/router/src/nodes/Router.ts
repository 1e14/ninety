import {createNode, Node} from "river-core";
import {eqArray} from "../callbacks";

export type In = {
  d_route: string;
};

export type Out = {
  d_pattern: RegExp
} & {
  [path: string]: Array<any>;
};

export type Router = Node<In, Out>;

const slice = Array.prototype.slice;

export function createRouter<R extends Array<RegExp>>(patterns: R): Router {
  const fields = patterns.map((pattern) => `r_${pattern}`);
  const patternCount = patterns.length;
  let lastRoute: string;
  let lastPattern: RegExp;
  let lastParams: Array<string>;
  return createNode<In, Out>
  (["d_pattern", ...fields], (outputs) => ({
    d_route: (value, tag) => {
      if (value !== lastRoute) {
        // looking for matching pattern
        for (let i = 0; i < patternCount; i++) {
          const pattern = patterns[i];
          const hits = pattern.exec(value);
          if (hits) {
            // pattern matches
            const params = slice.call(hits, 1);
            if (pattern !== lastPattern) {
              // route matches different pattern
              lastPattern = pattern;
              lastParams = params;
              outputs.d_pattern(pattern, tag);
              outputs[fields[i]](params, tag);
            } else if (!eqArray(params, lastParams)) {
              // route matches same pattern but parameters differ
              lastParams = params;
              outputs[fields[i]](params, tag);
            }
            break;
          }
        }
        lastRoute = value;
      }
    }
  }));
}
