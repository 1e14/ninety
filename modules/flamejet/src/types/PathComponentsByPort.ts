import {PathComponents} from "./PathComponents";

export type PathComponentsByPort<P extends string> = {
  [K in P]: PathComponents;
};
