import {connect, Node} from "1e14";
import {createFlameDiffSplitter} from "flamejet";
import {createDomTextView} from "ninety-ui-dom";
import {createParentView, ParentViewIn, ParentViewOut} from "ninety-view";
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
  const description = createDomTextView(() => "childNodes,1:P", depth + 1);
  const table = createStressTableView(() => "childNodes,2:TABLE", depth + 1);
  const splitter = createFlameDiffSplitter({
    d_desc: ["desc"],
    d_table: ["table"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_diff);
  connect(splitter.o.d_desc, description.i.d_vm);
  connect(splitter.o.d_table, table.i.d_vm);
  connect(description.o.d_view, view.i.d_view);
  connect(table.o.d_view, view.i.d_view);

  return view;
}
