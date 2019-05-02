import {Model} from "../../../../ninety-mvvm";
import {Person} from "./Person";
import {User} from "./User";

export type UserEndpointResponse = {
  persons: Model<Person>;
  users: Model<User>;
};
