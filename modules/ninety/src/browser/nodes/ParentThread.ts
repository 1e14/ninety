import {createNode, Node} from "1e14";

/**
 * TypeScript thinks the second argument of postMessage is mandatory.
 * Safari crashes on null as second parameter, so we're casting postMessage
 * to this similar function type.
 */
type PostMessageFunction = (message: any) => void;

export type In<I> = {
  d_msg: I
};

export type Out<O> = {
  d_msg: O;
};

export type ParentThread<I, O> = Node<In<I>, Out<O>>;

export function createParentThread<I, O>() {
  return createNode<In<I>, Out<O>>
  (["d_msg"], (outputs) => {
    self.addEventListener("message", ({data: {value, tag}}) => {
      outputs.d_msg(value, tag);
    });

    return {
      d_msg: (value, tag) => {
        (<PostMessageFunction>postMessage)({value, tag});
      }
    };
  });
}
