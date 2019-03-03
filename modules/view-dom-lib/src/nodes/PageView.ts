import {createDiffPrefixer, DiffPrefixer} from "gravel-core";

export type PageView = DiffPrefixer;

export function createPageView(): PageView {
  return createDiffPrefixer("body");
}
