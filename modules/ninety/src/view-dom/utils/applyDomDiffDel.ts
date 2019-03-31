import {Flame} from "../../flame/types";
import {getForkPos} from "../../flame/utils";
import {delDomProp} from "./delDomProp";

export function applyDomDiffDel(cache: Flame, diffDel: Flame): Flame {
  const bounced: Flame = {};
  let applied = true;
  let last: string = "";
  for (const path in diffDel) {
    const from = getForkPos(path, last);
    const success = delDomProp(cache, path, from);
    if (!success) {
      bounced[path] = null;
      applied = false;
    }
    last = path;
  }
  return applied ? undefined : bounced;
}
