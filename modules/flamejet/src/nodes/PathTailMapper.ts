import {createNode, Node} from "1e14";
import {Flame, PathMapperCallback, ValueMapperCallback} from "../types";
import {PATH_DELIMITER, replacePathTail} from "../utils";

export type In = {
  d_in: Flame;
};

export type Out = {
  d_out: Flame;
};

/**
 * Maps path tail/value pairs.
 */
export type PathTailMapper = Node<In, Out>;

/**
 * Creates a PathTailMapper node.
 * @param cbTail
 * @param cbValue
 */
export function createPathTailMapper(
  cbTail: PathMapperCallback,
  cbValue?: ValueMapperCallback
): PathTailMapper {
  return createNode<In, Out>
  (["d_out"], (outputs) => ({
    d_in: (flameIn, tag) => {
      const flameOut = {};
      if (cbValue) {
        for (const pathIn in flameIn) {
          const pos = pathIn.lastIndexOf(PATH_DELIMITER) + 1;
          const body = pathIn.slice(0, pos);
          const tailIn = pathIn.slice(pos);
          flameOut[body + cbTail(tailIn)] =
            cbValue(flameIn[pathIn], tailIn, pathIn);
        }
      } else {
        for (const pathIn in flameIn) {
          flameOut[replacePathTail(pathIn, cbTail)] = flameIn[pathIn];
        }
      }
      outputs.d_out(flameOut, tag);
    }
  }));
}
