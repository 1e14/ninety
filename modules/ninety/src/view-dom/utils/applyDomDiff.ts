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
  const cache = {"": window.document};
  const bouncedDel = applyDomDiffDel(cache, diffDel);
  const bouncedSet = applyDomDiffSet(cache, diffSet);
  return bouncedDel === undefined && bouncedSet === undefined ?
    undefined :
    {
      del: bouncedDel || {},
      set: bouncedSet || {}
    };
}
