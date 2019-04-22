import {Node} from "1e14";
import {createMapper} from "1e14-fp";
import {UserEndpointResponse} from "./UserEndpointResponse";

export type In = {
  d_req: any;
};

export type Out = {
  d_res: UserEndpointResponse;
};

export type UserEndpoint = Node<In, Out>;

export function createUserEndpoint(): UserEndpoint {
  const mapper = createMapper<any, UserEndpointResponse>(() => {
    return {
      persons: {
        200: {
          name: "Regina Phalange"
        },
        201: {
          name: "Phoebe Buffay"
        }
      },
      users: {
        100: {
          name: "regina",
          person: "200"
        },
        101: {
          name: "phoebe",
          person: "201"
        }
      }
    };
  });
  return {
    i: {
      d_req: mapper.i.d_val
    },
    o: {
      d_res: mapper.o.d_val
    }
  };
}
