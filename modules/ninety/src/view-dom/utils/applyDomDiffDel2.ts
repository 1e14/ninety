import {Flame} from "../../flame/types";
import {countCommonComponents} from "../../flame/utils";
import {delDomProp2} from "./delDomProp2";

export function applyDomDiffDel2(diffDel: Flame): Flame {
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
    const success = delDomProp2(stack, path);
    if (!success) {
      bounced[path] = null;
      applied = false;
    }
    last = path;
  }
  return applied ? undefined : bounced;
}
