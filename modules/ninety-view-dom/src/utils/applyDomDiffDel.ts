import {countCommonComponents, Flame} from "flamejet";
import {delDomProperty} from "./delDomProperty";

/**
 * Applies the 'del' side of a view diff to the DOM.
 * @param diffDel Collection of DOM path - null pairs.
 */
export function applyDomDiffDel(diffDel: Flame): Flame {
  const bounced: Flame = {};
  const stack = [window.document.body];
  let applied = true;
  let last: string = "body";
  for (const path in diffDel) {
    const count = countCommonComponents(path, last);
    if (stack.length > count) {
      // trimming stack back to common root
      stack.length = count;
    }
    const success = delDomProperty(stack, path);
    if (!success) {
      bounced[path] = null;
      applied = false;
    }
    last = path;
  }
  return applied ? undefined : bounced;
}
