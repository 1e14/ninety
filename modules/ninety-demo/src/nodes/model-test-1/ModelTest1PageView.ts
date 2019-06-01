import {createFlameSplitter} from "flamejet";
import {connect, Node} from "flowcode";
import {createParentView, ParentViewIn, ParentViewOut} from "ninety-mvvm";
import {createDomTextView} from "ninety-ui-dom";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type ModelTest1PageView = Node<In, Out>;

/**
 * @param path
 * @param depth
 */
export function createModelTest1PageView(
  path: string,
  depth: number = 0
): ModelTest1PageView {
  const view = createParentView(() => path, depth);
  const description = createDomTextView(() => "childNodes,0:P", depth + 1);
  const splitter = createFlameSplitter({
    d_desc: ["desc"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_val);
  connect(splitter.o.d_desc, description.i.d_vm);
  connect(description.o.d_view, view.i.d_view);

  return view;
}
