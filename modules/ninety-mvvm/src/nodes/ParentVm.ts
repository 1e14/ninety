import {createFlameBodyMapper, Flame, PathMapperCallback} from "flamejet";
import {Node} from "flowcode";

export type In = {
  d_model: Flame;
  d_vm: Flame;
};

export type Out = {
  d_model: Flame;
  d_vm: Flame;
};

export type ParentVm = Node<In, Out>;

export function createParentVm(
  cb: PathMapperCallback,
  depth: number = 0
): ParentVm {
  const flameBodyMapper = createFlameBodyMapper(cb, depth);
  return {
    i: {
      d_model: flameBodyMapper.i.d_in,
      d_vm: flameBodyMapper.i.d_out
    },
    o: {
      d_model: flameBodyMapper.o.d_in,
      d_vm: flameBodyMapper.o.d_out
    }
  };
}
