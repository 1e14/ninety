export type Invert<T extends { [key: string]: string }> = {
  [key in T[keyof T]]: keyof T
};
