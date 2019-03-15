import {Diff} from "gravel-core";
import {createLeafView} from "gravel-view";
import {Any, Node} from "river-core";

export type In = {
  vm_diff: Diff<Any>
};

export type Out = {
  v_diff: Diff<Any>
};

export type DomPropertyView2 = Node<In, Out>;

export function createDomPropertyView2(
  property: string,
  depth: number
): DomPropertyView2 {
  const view = createLeafView(() => property, depth);
  return {
    i: {
      vm_diff: view.i.v_diff
    },
    o: {
      v_diff: view.o.v_diff
    }
  };
}
