import {Flame} from "flamejet";
import {traverseFlame} from "flamejet/dist/utils/traverseFlame";
import {delDomProperty} from "./delDomProperty";
import {setDomProperty} from "./setDomProperty";

/**
 * Applies a view flame to the DOM.
 * @param view DOM flame.
 */
export function applyViewToDom(view: Flame): void {
  const stack = [window.document.body];
  traverseFlame(view, (path, value, start) => {
    if (stack.length > start) {
      // trimming stack back to common root
      stack.length = start;
    }
    if (value !== null) {
      setDomProperty(stack, path, value);
    } else {
      delDomProperty(stack, path);
    }
  }, "body");
}
