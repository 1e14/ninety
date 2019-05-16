import {connect} from "1e14";
import {createSplitter} from "1e14-flow";
import {createMapper} from "1e14-fp";
import {createDemuxer, createMuxer} from "1e14-mux";
import {createTicker} from "1e14-time";
import {createFlameBuffer, createFlameStore, Flame} from "flamejet";
import {normalizePaths} from "flamejet/dist/callbacks/map";
import {
  createModelExpander,
  createModelStore,
  createReferenceExtractor
} from "ninety-mvvm";
import {createRouter} from "ninety-router";
import {createParentThread} from "ninety-webworker";
import {createMainPageView} from "./nodes";
import {createEmptyPageVm} from "./nodes/empty";
import {createHelloWorldPageVm} from "./nodes/hello-world";
import {createUserEndpoint, Person, User} from "./nodes/model-test-1";
import {createModelTest1PageVm} from "./nodes/model-test-1/ModelTest1PageVm";
import {createStressTest1PageVm} from "./nodes/stress-test-1";
import {
  ROUTE_HELLO_WORLD,
  ROUTE_MODEL_TEST_1,
  ROUTE_REST,
  ROUTE_STRESS_TEST_1
} from "./utils";

// setting up thread communication
const parentThread = createParentThread();
const parentMuxer = createMuxer(["d_out"]);
const parentDemuxer = createDemuxer(["ev_dom_ready", "d_hash_path"]);
connect(parentThread.o.d_msg, parentDemuxer.i.d_mux);
connect(parentMuxer.o.d_mux, parentThread.i.d_msg);

// setting up routing
const ROUTES = [
  ROUTE_HELLO_WORLD,
  ROUTE_STRESS_TEST_1,
  ROUTE_MODEL_TEST_1,
  ROUTE_REST
];
const router = createRouter(ROUTES);
connect(parentDemuxer.o.d_hash_path, router.i.d_route);

// setting up main page
const mainPageView = createMainPageView();
const mainPageVm = createMapper<any, Flame>(() => ({
  "menu.0.link.text": "Hello world",
  "menu.0.link.url": "#hello-world",
  "menu.1.link.text": "Stress test (table)",
  "menu.1.link.url": "#stress-test-1",
  "menu.2.link.text": "Model reference test",
  "menu.2.link.url": "#model-test-1"
}));
connect(router.o.d_pattern, mainPageView.i.d_route);
connect(mainPageVm.o.d_val, mainPageView.i.d_vm);
connect(parentDemuxer.o.ev_dom_ready, mainPageVm.i.d_val);

// setting up pre-rendering
const ticker = createTicker(10, true);
const flameBuffer = createFlameBuffer();
const pathNormalizer = createMapper(normalizePaths);
connect(mainPageView.o.d_view, pathNormalizer.i.d_val);
connect(pathNormalizer.o.d_val, flameBuffer.i.d_val);
connect(ticker.o.ev_tick, flameBuffer.i.a_res);
connect(flameBuffer.o.d_val, parentMuxer.i.d_out);

// "page" 0: no content
const emptyPageVm = createEmptyPageVm();
connect(emptyPageVm.o.d_vm, mainPageView.i.d_vm);

// "page" 1: "hello world"
const helloWorldPageVm = createHelloWorldPageVm();
connect(helloWorldPageVm.o.d_vm, mainPageView.i.d_vm);

// "page" 2: stress test with large table
const stressTest1PageVm = createStressTest1PageVm("page", 0);
connect(stressTest1PageVm.o.d_vm, mainPageView.i.d_vm);

// "page" 3: model test with list with references
const userEndpoint = createUserEndpoint();
const responseSplitter = createSplitter(["users", "persons"]);
const userStore = createModelStore<User>();
const personStore = createModelStore<Person>();
const personReferenceExtractor = createReferenceExtractor({
  person: "d_person"
});
const userSampler = createMapper(() => ["100", "101"]);
const userExpander = createModelExpander<{
  d_model: User,
  d_person: Person
}>({
  d_model: {
    person: "d_person"
  },
  d_person: null
});
const structureModel = createFlameStore();
const modelTest1PageVm = createModelTest1PageVm("page", 0);
connect(userEndpoint.o.d_res, responseSplitter.i.all);
connect(responseSplitter.o.users, userStore.i.d_model);
connect(responseSplitter.o.persons, personStore.i.d_model);
connect(userSampler.o.d_val, userStore.i.a_smp);
connect(userSampler.o.d_val, structureModel.i.a_smp);
connect(userStore.o.d_model, userExpander.i.d_model);
connect(userStore.o.d_model, personReferenceExtractor.i.d_model);
connect(personReferenceExtractor.o.d_person, personStore.i.a_smp);
connect(userStore.o.ev_miss, userEndpoint.i.d_req);
connect(personStore.o.d_model, userExpander.i.d_person);
connect(userExpander.o.d_model, structureModel.i.d_val);
// tslint:disable:no-console
connect(structureModel.o.d_val, console.log);
// tslint:enable:no-console
connect(modelTest1PageVm.o.d_vm, mainPageView.i.d_vm);

// setting up routing table
connect(router.o[`r_${ROUTE_HELLO_WORLD}`], helloWorldPageVm.i.d_model);
connect(router.o[`r_${ROUTE_MODEL_TEST_1}`], modelTest1PageVm.i.ev_ready);
connect(router.o[`r_${ROUTE_MODEL_TEST_1}`], userSampler.i.d_val);
connect(router.o.d_pattern, stressTest1PageVm.i.d_route);
connect(router.o[`r_${ROUTE_REST}`], emptyPageVm.i.d_model);
