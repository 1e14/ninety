import {createDiffPrefixer, Diff} from "gravel-core";
import {InPorts, Node, OutPorts} from "river-core";

export type In = {
  v_diff: Diff<any>;
};

export type Out = {
  v_diff: Diff<any>;
};

export type PageView = Node<In, Out>;

export function createPageView(): PageView {
  const diffPrefixer = createDiffPrefixer("body");

  const i: InPorts<In> = {
    v_diff: diffPrefixer.i.d_diff
  };

  const o: OutPorts<Out> = {
    v_diff: diffPrefixer.o.d_diff
  };

  return {i, o};
}
