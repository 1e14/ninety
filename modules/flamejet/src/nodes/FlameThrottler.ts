import {createNode, Node} from "1e14";
import {Flame} from "../types";

export type In = {
  /** Maximum flame size. */
  d_fs: number;

  /** Flame to be throttled. */
  d_val: Flame;

  /** Requests next flame from the buffer. */
  ev_next: any;
};

export type Out = {
  /** Buffer size. */
  d_size: number;

  /** Next output flame. */
  d_val: Flame;

  /** Signals buffer went from empty to non-empty. */
  ev_load: any;
};

export type FlameThrottler = Node<In, Out>;

/**
 * Creates a FrameQueue node.
 * @param fs Initial frame size
 */
export function createFlameThrottler(fs: number = 512): FlameThrottler {
  return createNode<In, Out>
  (["d_size", "d_val", "ev_load"], (outputs) => {
    const buffer = new Map<string, any>();

    return {
      d_fs: (value) => {
        fs = value;
      },

      d_val: (value, tag) => {
        const sizeBefore = buffer.size;
        compoundFlames(buffer, value);
        const sizeAfter = buffer.size;
        if (!sizeBefore && sizeAfter) {
          outputs.ev_load(null, tag);
        }
        outputs.d_size(sizeAfter, tag);
      },

      ev_next: (dummy, tag) => {
        if (buffer.size) {
          outputs.d_val(extractNext(buffer, fs), tag);
          outputs.d_size(buffer.size, tag);
        }
      }
    };
  });
}

/**
 * Compounds flame on a flame buffer. Updates path/value pairs.
 * Handles subtree removal.
 * @param buffer
 * @param flame
 */
function compoundFlames(buffer: Map<string, any>, flame: Flame): void {
  // deleting paths from buffer that belong to a removed subtree
  for (const flamePath in flame) {
    const value = flame[flamePath];
    if (value === null) {
      for (const bufferPath of buffer.keys()) {
        if (bufferPath.startsWith(flamePath)) {
          buffer.delete(bufferPath);
        }
      }
    }
  }

  // transferring new values to buffer
  for (const path in flame) {
    buffer.set(path, flame[path]);
  }
}

/**
 * Extracts next flame of a given size from the buffer. The extracted flame
 * is removed from the buffer before being returned.
 * @param buffer
 * @param fs
 */
function extractNext(buffer: Map<string, any>, fs: number): Flame {
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
