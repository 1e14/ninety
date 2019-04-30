import {connect, Node} from "1e14";
import {createFlameSplitter} from "flamejet";
import {createDomTextView} from "ninety-ui-dom";
import {createParent, ParentIn, ParentOut} from "ninety-view";

export type In = ParentIn;

export type Out = ParentOut;

export type ModelTest1PageView = Node<In, Out>;

/**
 * @param path
 * @param depth
 */
export function createModelTest1PageView(
  path: string,
  depth: number = 0
): ModelTest1PageView {
  const view = createParent(() => path, depth);
  const description = createDomTextView(() => "childNodes,0:P", depth + 1);
  const splitter = createFlameSplitter({
    d_desc: ["desc"]
  }, depth + 1);

  connect(view.o.d_in, splitter.i.d_val);
  connect(splitter.o.d_desc, description.i.d_in);
  connect(description.o.d_out, view.i.d_out);

  return view;
}
