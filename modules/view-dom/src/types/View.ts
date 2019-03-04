import {Diff} from "gravel-core";
import {Node} from "river-core";

export type In<T> = {
  v_diff: Diff<any>;
  vm_diff: Diff<T>;
};

export type Out = {
  v_diff: Diff<any>;
};

export type View<T> = Node<In<T>, Out>;
