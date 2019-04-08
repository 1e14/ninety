import {createNode, Node} from "1e14";
import {FlameDiff} from "flamejet";

export type In = {
  /**
   * Maximum frame size.
   */
  d_fs: number;

  /**
   * View to be buffered.
   */
  d_view: FlameDiff;

  /**
   * Requests next frame from the buffer.
   */
  ev_next: any;
};

export type Out = {
  /**
   * Next frame.
   */
  d_frame: FlameDiff;

  /**
   * Buffer size.
   */
  d_size: number;

  /**
   * Signals queue going from empty to non-empty.
   */
  ev_load: any;
};

/**
 * Breaks down and queues diffs as frames of a specified size.
 */
export type FrameBuffer = Node<In, Out>;

/**
 * Creates a FrameQueue node.
 * @param fs Initial frame size
 */
export function createFrameBuffer(fs: number = 512): FrameBuffer {
  return createNode<In, Out>
  (["d_frame", "d_size", "ev_load"], (outputs) => {
    const bufferSet = new Map<string, any>();
    const bufferDel = new Set<string>();

    return {
      d_fs: (value) => {
        fs = value;
      },

      d_view: (value, tag) => {
        const sizeBefore = bufferSet.size + bufferDel.size;
        compoundView(bufferSet, bufferDel, value);
        const sizeAfter = bufferSet.size + bufferDel.size;
        if (!sizeBefore && sizeAfter) {
          outputs.ev_load(null, tag);
        }
        outputs.d_size(sizeAfter, tag);
      },

      ev_next: (dummy, tag) => {
        if (bufferSet.size + bufferDel.size) {
          outputs.d_frame(extractNextFrame(bufferSet, bufferDel, fs), tag);
          outputs.d_size(bufferSet.size + bufferDel.size, tag);
        }
      }
    };
  });
}

function compoundView(
  bufferSet: Map<string, any>,
  bufferDel: Set<string>,
  view: FlameDiff
): void {
  const {set, del} = view;
  for (const path in del) {
    if (bufferSet.has(path)) {
      bufferSet.delete(path);
    } else {
      bufferDel.add(path);
    }
  }
  for (const path in set) {
    if (bufferDel.has(path)) {
      bufferDel.delete(path);
    } else {
      bufferSet.set(path, set[path]);
    }
  }
}

function extractNextFrame(
  bufferSet: Map<string, any>,
  bufferDel: Set<string>,
  fs: number
): FlameDiff {
  const set = {};
  const del = {};
  let i = fs;
  for (const path of bufferDel) {
    del[path] = null;
    bufferDel.delete(path);
    if (!--i) {
      break;
    }
  }
  for (const [path, value] of bufferSet.entries()) {
    set[path] = value;
    bufferSet.delete(path);
    if (!--i) {
      break;
    }
  }
  return {set, del};
}
