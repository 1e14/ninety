import {createView, View} from "gravel-view-dom";

export type PageView = View<any>;

export function createPageView(): PageView {
  return createView("body");
}
