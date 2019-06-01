import {
  createFlameEdgeMapper,
  Flame,
  PathMapperCallback,
  ValueMapperCallback
} from "flamejet";
import {Node} from "flowcode";

export type In = {
  d_model: Flame;
};

export type Out = {
  d_vm: Flame;
};

export type LeafVm = Node<In, Out>;

export function createLeafVm(
  cbTail: PathMapperCallback,
  cbValue?: ValueMapperCallback
): LeafVm {
  const flameEdgeMapper = createFlameEdgeMapper(cbTail, cbValue);
  return {
    i: {
      d_model: flameEdgeMapper.i.d_in
    },
    o: {
      d_vm: flameEdgeMapper.o.d_out
    }
  };
}
