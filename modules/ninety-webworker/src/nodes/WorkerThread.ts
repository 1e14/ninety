import {createNode, Node} from "flowcode";

export type In<I> = {
  d_msg: I;
};

export type Out<O> = {
  d_msg: O;
  ev_err: any;
};

export type WorkerThread<I, O> = Node<In<I>, Out<O>>;

export function createWorkerThread<I, O>(script: string): WorkerThread<I, O> {
  return createNode<In<I>, Out<O>>
  (["d_msg", "ev_err"], (outputs) => {
    const worker = new Worker(script);

    worker.onmessage = (event) => {
      const {value, tag} = event.data;
      outputs.d_msg(value, tag);
    };

    worker.onerror = () => {
      outputs.ev_err(null);
    };

    return {
      d_msg: (value, tag) => {
        worker.postMessage({value, tag});
      }
    };
  });
}
