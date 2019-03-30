import {Flame} from "../../flame/types";
import {getForkPos} from "../../flame/utils";
import {setDomProp} from "./setDomProp";

export function applyDomDiffSet(cache: Flame, diffSet: Flame): Flame {
  const bounced: Flame = {};
  let applied = true;
  let last: string = "";
  for (const path in diffSet) {
    const from = getForkPos(path, last);
    const value = diffSet[path];
    const success = setDomProp(cache, path, value, from);
    if (!success) {
      bounced[path] = value;
      applied = false;
    }
    last = path;
  }
  return applied ? undefined : bounced;
}
