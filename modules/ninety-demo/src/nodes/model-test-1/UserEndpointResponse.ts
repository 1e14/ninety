import {ModelBuffer} from "ninety-model";
import {Person} from "./Person";
import {User} from "./User";

export type UserEndpointResponse = {
  persons: ModelBuffer<Person>;
  users: ModelBuffer<User>;
};
