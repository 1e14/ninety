import {Flame} from "../../flame/types";
import {countCommonComponents} from "../../flame/utils";
import {setDomProp2} from "./setDomProp2";

export function applyDomDiffSet2(diffSet: Flame): Flame {
  const bounced: Flame = {};
  const stack = [window.document.body];
  let applied = true;
  let last: string = "";
  for (const path in diffSet) {
    const count = countCommonComponents(path, last);
    if (stack.length > count) {
      // trimming stack back to common root
      stack.length = count;
    }
    const value = diffSet[path];
    const success = setDomProp2(stack, path, value);
    if (!success) {
      bounced[path] = value;
      applied = false;
    }
    last = path;
  }
  return applied ? undefined : bounced;
}
