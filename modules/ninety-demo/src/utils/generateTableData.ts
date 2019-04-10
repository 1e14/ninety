import {Flame} from "flamejet";

const COLORS = ["red", "green", "blue", "black", "purple", "teal", "grey"];

export function generateTableData(path: string, rows: number, columns: number): Flame {
  const flame = {};
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      flame[`${path}.${i},${j}.content.text`] = Math.round(Math.random() * 1000);
      flame[`${path}.${i},${j}.content.color`] = COLORS[Math.floor(Math.random() * 7)];
    }
  }
  return flame;
}
