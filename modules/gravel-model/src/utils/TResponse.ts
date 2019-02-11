import {IJsonObject, TJson} from "./TJson";

export interface IResponses extends IJsonObject {
  [endpoint: string]: TJson;
}
