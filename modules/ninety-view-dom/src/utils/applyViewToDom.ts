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
  traverseFlame(view, (path, value, commonPathLength) => {
    // stack is one item longer than path b/c of root
    const maxStackLength = commonPathLength + 1;
    if (stack.length > maxStackLength) {
      stack.length = maxStackLength;
    }
    if (value !== null) {
      setDomProperty(stack, path, value);
    } else {
      delDomProperty(stack, path);
    }
  });
}
