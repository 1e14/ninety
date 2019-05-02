import {Node} from "1e14";
import {
  createFlameEdgeMapper,
  Flame,
  PathMapperCallback,
  ValueMapperCallback
} from "flamejet";

export type In = {
  d_vm: Flame;
};

export type Out = {
  d_view: Flame;
};

export type LeafView = Node<In, Out>;

export function createLeafView(
  cbTail: PathMapperCallback,
  cbValue?: ValueMapperCallback
): LeafView {
  const flameEdgeMapper = createFlameEdgeMapper(cbTail, cbValue);
  return {
    i: {
      d_vm: flameEdgeMapper.i.d_in
    },
    o: {
      d_view: flameEdgeMapper.o.d_out
    }
  };
}
