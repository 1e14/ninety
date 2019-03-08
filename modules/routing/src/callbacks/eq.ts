export function eqArray(a, b) {
  if (a === b) {
    return true;
  } else if (!a || !b) {
    return false;
  } else if (a.length !== b.length) {
    return false;
  } else {
    for (let i = 0, length = a.length; i < length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
}
