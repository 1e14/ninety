import {FlameDiff} from "flamejet";

const COLORS = ["red", "green", "blue", "black", "purple", "teal", "grey"];

export function generateTableData(path: string, rows: number, columns: number): FlameDiff {
  const set = {};
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      set[`${path}.${i},${j}.content.text`] = Math.round(Math.random() * 1000);
      set[`${path}.${i},${j}.content.color`] = COLORS[Math.floor(Math.random() * 7)];
    }
  }
  return {set, del: {}};
}
