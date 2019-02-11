export interface IJsonObject {
  [key: string]: TJson;
}

export interface IJsonArray extends Array<TJson> {
}

export type TJson =
  string |
  number |
  boolean |
  null |
  IJsonObject |
  IJsonArray;
