import {Diff} from "gravel-core";
import {Any} from "river-core";

export function generateTableData(rows: number, columns: number): Diff<Any> {
  const set = {};
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      set[`${i}.${j}`] = Math.round(Math.random() * 1000);
    }
  }
  return {set, del: {}};
}
