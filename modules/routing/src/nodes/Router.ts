import {createNode, Node} from "river-core";
import {eqArray} from "../callbacks";

export type In = {
  d_route: string;
};

export type Out = {
  d_template: RegExp
} & {
  [path: string]: Array<any>;
};

export type Router = Node<In, Out>;

const slice = Array.prototype.slice;

export function createRouter<R extends Array<RegExp>>(templates: R): Router {
  const fields = templates.map((template) => `r_${template}`);
  return createNode<In, Out>
  (["d_template", ...fields], (outputs) => {
    const templateCount = templates.length;
    let lastRoute: string;
    let lastTemplate: RegExp;
    let lastParams: Array<string>;
    return {
      d_route: (value, tag) => {
        if (value !== lastRoute) {
          // looking for matching template
          for (let i = 0; i < templateCount; i++) {
            const template = templates[i];
            const components = template.exec(value);
            if (components) {
              // template matches
              if (template !== lastTemplate) {
                // matching template changed
                lastTemplate = template;
                outputs.d_template(template, tag);
              }
              const params = slice.call(components, 1);
              if (!eqArray(params, lastParams)) {
                // parameters differ
                outputs[fields[i]](params, tag);
                lastParams = params;
              }
              break;
            }
          }
          lastRoute = value;
        }
      }
    };
  });
}
