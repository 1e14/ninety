import {createFlameSplitter} from "flamejet";
import {connect, Node} from "flowcode";
import {createParentView, ParentViewIn, ParentViewOut} from "ninety-mvvm";
import {createDomTextView} from "ninety-ui-dom";
import {createStressTableView} from "./StressTableView";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type StressTest1PageView = Node<In, Out>;

/**
 * @param path
 * @param depth
 */
export function createStressTest1PageView(
  path: string,
  depth: number = 0
): StressTest1PageView {
  const view = createParentView(() => path, depth);
  const description = createDomTextView(() => "childNodes,0:P", depth + 1);
  const table = createStressTableView(() => "childNodes,1:TABLE", depth + 1);
  const splitter = createFlameSplitter({
    d_desc: ["desc"],
    d_table: ["table"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_val);
  connect(splitter.o.d_desc, description.i.d_vm);
  connect(splitter.o.d_table, table.i.d_vm);
  connect(description.o.d_view, view.i.d_view);
  connect(table.o.d_view, view.i.d_view);

  return view;
}
