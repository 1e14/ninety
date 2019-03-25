import {createNode, Node} from "1e14";

export type In<I> = {
  d_msg: I
};

export type Out<O> = {
  d_msg: O;
};

export type ParentThread<I, O> = Node<In<I>, Out<O>>;

let instance: ParentThread<any, any>;

export function createParentThread<I, O>() {
  if (!instance) {
    instance = createNode<In<I>, Out<O>>
    (["d_msg"], (outputs) => {
      onmessage = ({data: {value, tag}}) => {
        outputs.d_msg(value, tag);
      };

      return {
        d_msg: (value, tag) => {
          postMessage({value, tag}, null);
        }
      };
    });
  }
  return instance;
}