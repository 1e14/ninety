import {FlameDiff} from "flamejet";
import {applyDomDiffDel} from "./applyDomDiffDel";
import {applyDomDiffSet} from "./applyDomDiffSet";

/**
 * Applies the specified view diff to the DOM.
 * @param diff
 */
export function applyDomDiff(diff: FlameDiff): void {
  applyDomDiffDel(diff.del);
  applyDomDiffSet(diff.set);
}
