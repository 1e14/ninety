import {IdList} from "./IdList";

/**
 * Type parameter T describes available model types.
 */
export type IdListsByModelType<T extends string> = {
  [type in T]: IdList
};
