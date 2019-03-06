import {Diff} from "gravel-core";
import {createView, ViewIn, ViewOut} from "gravel-view-dom";
import {Node} from "river-core";

export type VmProps = {
  url: string;
  content: string;
};

export type In = ViewIn<VmProps>;

export type Out = ViewOut;

export type LinkView = Node<In, Out>;

export function createLinkView(
  path: string = "",
  content: Diff<any> = {}
): LinkView {
  return createView<VmProps>(path, content, (vm) => {
    const set = vm.set;
    const del = vm.del;
    return {
      del: {
        href: del && del.url,
        innerText: del && del.content
      },
      set: {
        href: set && set.url,
        innerText: set && set.content
      }
    };
  });
}
