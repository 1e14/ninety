import {createNode, Node} from "1e14";
import {Flame} from "flamejet";

export type In = {
  /**
   * Maximum frame size.
   */
  d_fs: number;

  /**
   * View to be buffered.
   */
  d_view: Flame;

  /**
   * Requests next frame from the buffer.
   */
  ev_next: any;
};

export type Out = {
  /**
   * Next frame.
   */
  d_frame: Flame;

  /**
   * Buffer size.
   */
  d_size: number;

  /**
   * Signals queue going from empty to non-empty.
   */
  ev_load: any;
};

export type FrameBuffer = Node<In, Out>;

/**
 * Creates a FrameQueue node.
 * @param fs Initial frame size
 */
export function createFrameBuffer(fs: number = 512): FrameBuffer {
  return createNode<In, Out>
  (["d_frame", "d_size", "ev_load"], (outputs) => {
    const buffer = new Map<string, any>();

    return {
      d_fs: (value) => {
        fs = value;
      },

      d_view: (value, tag) => {
        const sizeBefore = buffer.size;
        compoundView(buffer, value);
        const sizeAfter = buffer.size;
        if (!sizeBefore && sizeAfter) {
          outputs.ev_load(null, tag);
        }
        outputs.d_size(sizeAfter, tag);
      },

      ev_next: (dummy, tag) => {
        if (buffer.size) {
          outputs.d_frame(extractNextFrame(buffer, fs), tag);
          outputs.d_size(buffer.size, tag);
        }
      }
    };
  });
}

function compoundView(
  buffer: Map<string, any>,
  view: Flame
): void {
  for (const path in view) {
    buffer.set(path, view[path]);
  }
}

function extractNextFrame(
  buffer: Map<string, any>,
  fs: number
): Flame {
  let i = Math.min(fs, buffer.size);
  const frame = {};
  for (const [path, value] of buffer.entries()) {
    frame[path] = value;
    buffer.delete(path);
    if (!--i) {
      break;
    }
  }
  return frame;
}
