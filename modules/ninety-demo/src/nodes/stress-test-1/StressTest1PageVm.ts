import {Flame} from "flamejet";
import {connect, createNoop, Node} from "flowcode";
import {createMapper} from "flowcode-fp";
import {createTicker} from "flowcode-time";
import {createParentVm, ParentVmIn, ParentVmOut} from "ninety-mvvm";
import {ROUTE_STRESS_TEST_1} from "../../utils/routes";
import {generateTableVm} from "./utils/generateTableVm";

export type In = ParentVmIn & {
  a_stat: any;

  /** @deprecated */
  d_hash_path: string;
};

export type Out = ParentVmOut;

export type StressTest1PageVm = Node<In, Out>;

export function createStressTest1PageVm(
  path: string,
  depth: number = 0
): StressTest1PageVm {
  const vm = createParentVm(() => path, depth);
  const staticVm = createMapper(() => ({
    "page": null,
    "page.desc.text": "Firehose test using a table with 1024 cells"
  }));
  const readyForwarder = createNoop();
  const routeDetector = createMapper<string, boolean>(
    (value) => ROUTE_STRESS_TEST_1.test(value));
  const tableTicker = createTicker(100);
  // TODO: Should receive data from the outside.
  const tableDataGenerator = createMapper<any, Flame>(
    () => generateTableVm("page.table", 32, 32));

  connect(readyForwarder.o.d_val, staticVm.i.d_val);
  connect(routeDetector.o.d_val, tableTicker.i.st_ticking);
  connect(readyForwarder.o.d_val, tableDataGenerator.i.d_val);
  connect(tableTicker.o.ev_tick, tableDataGenerator.i.d_val);
  connect(staticVm.o.d_val, vm.i.d_vm);
  connect(tableDataGenerator.o.d_val, vm.i.d_vm);

  return {
    i: {
      a_stat: readyForwarder.i.d_val,
      d_hash_path: routeDetector.i.d_val,
      d_model: vm.i.d_model,
      d_vm: vm.i.d_vm
    },
    o: {
      d_model: vm.o.d_model,
      d_vm: vm.o.d_vm
    }
  };
}
