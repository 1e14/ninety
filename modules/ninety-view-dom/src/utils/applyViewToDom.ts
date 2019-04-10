import {countCommonComponents, Flame} from "flamejet";
import {delDomProperty} from "./delDomProperty";
import {setDomProperty} from "./setDomProperty";

/**
 * Applies the 'set' side of a view to the DOM.
 * @param view Collection of DOM path - value pairs.
 */
export function applyViewToDom(view: Flame): void {
  const stack = [window.document.body];
  let last: string = "body";
  for (const path in view) {
    const count = countCommonComponents(path, last);
    if (stack.length > count) {
      // trimming stack back to common root
      stack.length = count;
    }
    const value = view[path];
    if (value !== null) {
      setDomProperty(stack, path, value);
    } else {
      delDomProperty(stack, path);
    }
    last = path;
  }
}
