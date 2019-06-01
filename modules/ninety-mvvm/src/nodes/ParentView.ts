import {createFlameBodyMapper, Flame, PathMapperCallback} from "flamejet";
import {Node} from "flowcode";

export type In = {
  d_view: Flame;
  d_vm: Flame;
};

export type Out = {
  d_view: Flame;
  d_vm: Flame;
};

export type ParentView = Node<In, Out>;

export function createParentView(
  cb: PathMapperCallback,
  depth: number = 0
): ParentView {
  const flameBodyMapper = createFlameBodyMapper(cb, depth);
  return {
    i: {
      d_view: flameBodyMapper.i.d_out,
      d_vm: flameBodyMapper.i.d_in
    },
    o: {
      d_view: flameBodyMapper.o.d_out,
      d_vm: flameBodyMapper.o.d_in
    }
  };
}
