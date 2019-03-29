export function getForkPos(path1: string, path2: string): number {
  let i = 0;
  while (path1[i] === path2[i]) {
    i++;
  }
  return i;
}
