import {Store} from "ninety-model";

export type UserStore = Store<{
  name: string;
  person: string; // reference
}>;
