import {PathComponents} from "./PathComponents";

export type ComponentsByPort<P extends string> = {
  [K in P]: PathComponents;
};
