import {Flame, FlameDiff, getRootPath, NullFlame} from "../../flame";
import {delDomProperty} from "./delDomProperty";
import {getDomProperty} from "./getDomProperty";
import {setDomProperty} from "./setDomProperty";

/**
 * TODO: Tests
 * @param diffDel
 */
function applyDomDiffDel(diffDel: NullFlame): NullFlame {
  const bounced = {};
  const root = getRootPath(diffDel);
  let applied = true;
  if (root) {
    const {node, property} = getDomProperty(root);
    if (node) {
      for (const path in diffDel) {
        const success = delDomProperty(
          property,
          node,
          path.substr(root.length + 1));
        if (!success) {
          bounced[path] = null;
          applied = false;
        }
      }
    }
  } else {
    for (const path in diffDel) {
      if (!delDomProperty(document, document, path)) {
        bounced[path] = null;
        applied = false;
      }
    }
  }
  return applied ? undefined : bounced;
}

/**
 * @param diffSet
 */
function applyDomDiffSet(diffSet: Flame): Flame {
  const bounced = {};
  const root = getRootPath(diffSet);
  let applied = true;
  if (root) {
    for (const path in diffSet) {
      setDomProperty(document, document, path, diffSet[path]);
      break;
    }
    const {node, property} = getDomProperty(root);
    for (const path in diffSet) {
      const value = diffSet[path];
      const success = setDomProperty(
        property,
        node,
        path.substr(root.length + 1),
        value);
      if (!success) {
        bounced[path] = value;
        applied = false;
      }
    }
  } else {
    for (const path in diffSet) {
      const value = diffSet[path];
      if (!setDomProperty(document, document, path, value)) {
        bounced[path] = value;
        applied = false;
      }
    }
  }
  return applied ? undefined : bounced;
}

/**
 * Applies the specified view diff to the DOM.
 * @param diff
 */
export function applyDomDiff(diff: FlameDiff): FlameDiff {
  const diffDel = diff.del;
  const diffSet = diff.set;
  const bouncedDel = applyDomDiffDel(diffDel);
  const bouncedSet = applyDomDiffSet(diffSet);
  return bouncedDel === undefined && bouncedSet === undefined ?
    undefined :
    {
      del: bouncedDel || {},
      set: bouncedSet || {}
    };
}
