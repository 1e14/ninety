import {FlameDiff} from "90";

const COLORS = ["red", "green", "blue", "black", "purple", "teal", "grey"];

export function generateTableData(rows: number, columns: number): FlameDiff {
  const set = {};
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      set[`${i}.${j}.text`] = Math.round(Math.random() * 1000);
      set[`${i}.${j}.color`] = COLORS[Math.floor(Math.random() * 7)];
    }
  }
  return {set, del: {}};
}
