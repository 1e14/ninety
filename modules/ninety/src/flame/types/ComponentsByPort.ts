import {Components} from "./Components";

export type ComponentsByPort<P extends string> = {
  [K in P]: Components;
};
