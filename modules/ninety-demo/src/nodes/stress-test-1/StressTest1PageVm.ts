import {Flame} from "flamejet";
import {connect, createNoop, Node} from "flowcode";
import {createMapper} from "flowcode-fp";
import {createTicker} from "flowcode-time";
import {createParentVm, ParentVmIn, ParentVmOut} from "ninety-mvvm";
import {generateTableVm} from "../../utils";

export type In = ParentVmIn & {
  ev_ready: any;
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
  const tableTicker = createTicker(100, true);
  // TODO: Should receive data from the outside.
  const tableDataGenerator = createMapper<any, Flame>(
    () => generateTableVm("page.table", 32, 32));

  connect(readyForwarder.o.d_val, staticVm.i.d_val);
  // FIXME: 'st_ticking' never gets reset
  connect(readyForwarder.o.d_val, tableTicker.i.st_ticking);
  connect(readyForwarder.o.d_val, tableDataGenerator.i.d_val);
  connect(tableTicker.o.ev_tick, tableDataGenerator.i.d_val);
  connect(staticVm.o.d_val, vm.i.d_vm);
  connect(tableDataGenerator.o.d_val, vm.i.d_vm);

  return {
    i: {
      d_model: vm.i.d_model,
      d_vm: vm.i.d_vm,
      ev_ready: readyForwarder.i.d_val
    },
    o: {
      d_model: vm.o.d_model,
      d_vm: vm.o.d_vm
    }
  };
}
