import {connect, Node} from "1e14";
import {
  createParentView,
  ParentViewIn,
  ParentViewOut,
  PathMapperCallback
} from "ninety";
import {createStressTableCellView} from "./StressTableCellView";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type StressTableView = Node<In, Out>;

export function createStressTableView(
  cb: PathMapperCallback,
  depth: number = 0
): StressTableView {
  const view = createParentView(cb, depth);
  const cell = createStressTableCellView(depth + 1);

  connect(view.o.d_vm, cell.i.d_vm);
  connect(cell.o.d_view, view.i.d_view);

  return view;
}
