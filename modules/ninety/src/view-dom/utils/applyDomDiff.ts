import {FlameDiff} from "../../flame";
import {applyDomDiffDel} from "./applyDomDiffDel";
import {applyDomDiffSet} from "./applyDomDiffSet";

/**
 * Applies the specified view diff to the DOM.
 * @param diff
 */
export function applyDomDiff(diff: FlameDiff): FlameDiff {
  const diffDel = diff.del;
  const diffSet = diff.set;
  const bouncedDel = applyDomDiffDel(diffDel);
  const bouncedSet = applyDomDiffSet(diffSet);
  return bouncedDel === undefined && bouncedSet === undefined ?
    undefined :
    {
      del: bouncedDel || {},
      set: bouncedSet || {}
    };
}
