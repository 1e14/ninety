import {countCommonComponents, Flame} from "flamejet";
import {delDomProperty} from "./delDomProperty";
import {setDomProperty} from "./setDomProperty";

/**
 * Applies a view flame to the DOM.
 * @param view DOM flame.
 */
export function applyViewToDom(view: Flame): void {
  deleteDomProperties(view);
  setDomProperties(view);
}

function deleteDomProperties(view: Flame): void {
  const stack = [window.document.body];
  let last: string = "body";
  for (const path in view) {
    const value = view[path];
    if (value === null) {
      const count = countCommonComponents(path, last);
      if (stack.length > count) {
        // trimming stack back to common root
        stack.length = count;
      }
      delDomProperty(stack, path);
    }
    last = path;
  }
}

function setDomProperties(view: Flame): void {
  const stack = [window.document.body];
  let last: string = "body";
  for (const path in view) {
    const value = view[path];
    if (value !== null) {
      const count = countCommonComponents(path, last);
      if (stack.length > count) {
        // trimming stack back to common root
        stack.length = count;
      }
      setDomProperty(stack, path, value);
    }
    last = path;
  }
}
