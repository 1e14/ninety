import {connect, Node} from "1e14";
import {createFlameSplitter, createParent, ParentIn, ParentOut} from "flamejet";
import {createDomTextView} from "ninety-ui-dom";
import {createStressTableView} from "./StressTableView";

export type In = ParentIn;

export type Out = ParentOut;

export type StressTest1PageView = Node<In, Out>;

/**
 * @param path
 * @param depth
 */
export function createStressTest1PageView(
  path: string,
  depth: number = 0
): StressTest1PageView {
  const view = createParent(() => path, depth);
  const description = createDomTextView(() => "childNodes,0:P", depth + 1);
  const table = createStressTableView(() => "childNodes,1:TABLE", depth + 1);
  const splitter = createFlameSplitter({
    d_desc: ["desc"],
    d_table: ["table"]
  }, depth + 1);

  connect(view.o.d_in, splitter.i.d_val);
  connect(splitter.o.d_desc, description.i.d_in);
  connect(splitter.o.d_table, table.i.d_in);
  connect(description.o.d_out, view.i.d_out);
  connect(table.o.d_out, view.i.d_out);

  return view;
}
