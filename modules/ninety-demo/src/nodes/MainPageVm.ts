import {Flame} from "flamejet/dist";
import {connect, createNoop, Node} from "flowcode";
import {createMapper} from "flowcode-fp";
import {createRootVm, ParentVmIn, ParentVmOut} from "ninety-mvvm";
import {createRouter} from "ninety-router/dist";
import {
  ROUTE_HELLO_WORLD,
  ROUTE_MODEL_TEST_1,
  ROUTE_REST,
  ROUTE_STRESS_TEST_1,
  ROUTES
} from "../utils";
import {createEmptyPageVm} from "./empty";
import {createHelloWorldPageVm} from "./hello-world";
import {createModelTest1PageVm} from "./model-test-1/ModelTest1PageVm";
import {createStressTest1PageVm} from "./stress-test-1";

export type In = ParentVmIn & {
  /** Determines child VMs to use. */
  d_hash_path: string;

  /** Triggers emitting static VM. */
  ev_ready: any;
};

export type Out = ParentVmOut;

export type MainPageVm = Node<In, Out>;

const MAIN_PAGE_DEPTH = 0;

export function createMainPageVm(): MainPageVm {
  const vm = createRootVm();
  const hashPathForwarder = createNoop();
  const readyForwarder = createNoop();
  const staticVm = createMapper<any, Flame>(() => ({
    "menu.0.link.text": "Hello world",
    "menu.0.link.url": "#hello-world",
    "menu.1.link.text": "Stress test (table)",
    "menu.1.link.url": "#stress-test-1",
    "menu.2.link.text": "Model reference test",
    "menu.2.link.url": "#model-test-1"
  }));
  const router = createRouter(ROUTES);
  const emptyPageVm = createEmptyPageVm();
  const helloWorldPageVm = createHelloWorldPageVm();
  const stressTest1PageVm = createStressTest1PageVm("page", MAIN_PAGE_DEPTH);
  const modelTest1PageVm = createModelTest1PageVm("page", MAIN_PAGE_DEPTH);

  connect(hashPathForwarder.o.d_val, router.i.d_route);
  connect(hashPathForwarder.o.d_val, stressTest1PageVm.i.d_hash_path);
  connect(readyForwarder.o.d_val, staticVm.i.d_val);
  connect(router.o[`r_${ROUTE_REST}`], emptyPageVm.i.ev_ready);
  connect(router.o[`r_${ROUTE_HELLO_WORLD}`], helloWorldPageVm.i.ev_ready);
  connect(router.o[`r_${ROUTE_STRESS_TEST_1}`], stressTest1PageVm.i.ev_ready);
  connect(router.o[`r_${ROUTE_MODEL_TEST_1}`], modelTest1PageVm.i.ev_ready);
  connect(emptyPageVm.o.d_vm, vm.i.d_vm);
  connect(helloWorldPageVm.o.d_vm, vm.i.d_vm);
  connect(stressTest1PageVm.o.d_vm, vm.i.d_vm);
  connect(modelTest1PageVm.o.d_vm, vm.i.d_vm);
  connect(staticVm.o.d_val, vm.i.d_vm);

  return {
    i: {
      d_hash_path: hashPathForwarder.i.d_val,
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
