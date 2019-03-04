import {createDiffPrefixer} from "gravel-core";
import {View, ViewIn, ViewOut} from "gravel-view-dom";
import {InPorts, OutPorts} from "river-core";

export type PageView = View<any>;

export function createPageView(): PageView {
  const diffPrefixer = createDiffPrefixer("body");

  const i: InPorts<ViewIn<any>> = {
    v_diff: diffPrefixer.i.d_diff,
    vm_diff: () => null
  };

  const o: OutPorts<ViewOut> = {
    v_diff: diffPrefixer.o.d_diff
  };

  return {i, o};
}
