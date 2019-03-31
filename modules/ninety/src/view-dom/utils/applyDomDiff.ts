import {FlameDiff} from "../../flame";
import {applyDomDiffDel2} from "./applyDomDiffDel2";
import {applyDomDiffSet2} from "./applyDomDiffSet2";

/**
 * Applies the specified view diff to the DOM.
 * @param diff
 */
export function applyDomDiff(diff: FlameDiff): FlameDiff {
  const diffDel = diff.del;
  const diffSet = diff.set;
  const bouncedDel = applyDomDiffDel2(diffDel);
  const bouncedSet = applyDomDiffSet2(diffSet);
  return bouncedDel === undefined && bouncedSet === undefined ?
    undefined :
    {
      del: bouncedDel || {},
      set: bouncedSet || {}
    };
}
