import {countCommonComponents, Flame} from "flamejet";
import {setDomProperty} from "./setDomProperty";

/**
 * Applies the 'set' side of a view diff to the DOM.
 * @param diffSet Collection of DOM path - value pairs.
 */
export function applyDomDiffSet(diffSet: Flame): void {
  const stack = [window.document.body];
  let last: string = "body";
  for (const path in diffSet) {
    const count = countCommonComponents(path, last);
    if (stack.length > count) {
      // trimming stack back to common root
      stack.length = count;
    }
    const value = diffSet[path];
    setDomProperty(stack, path, value);
    last = path;
  }
}
