import {createFlameBuffer, createFlameStore} from "flamejet";
import {normalizePaths} from "flamejet/dist/callbacks/map";
import {connect} from "flowcode";
import {createSplitter} from "flowcode-flow";
import {createMapper} from "flowcode-fp";
import {createDemuxer, createMuxer} from "flowcode-mux";
import {createTicker} from "flowcode-time";
import {
  createModelExpander,
  createModelStore,
  createReferenceExtractor
} from "ninety-mvvm";
import {createRouter} from "ninety-router";
import {createParentThread} from "ninety-webworker";
import {createMainPageView} from "./nodes";
import {createMainPageVm} from "./nodes/MainPageVm";
import {createUserEndpoint, Person, User} from "./nodes/model-test-1";
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
const mainPageVm = createMainPageVm();
connect(parentDemuxer.o.d_hash_path, mainPageVm.i.d_hash_path);
connect(router.o.d_pattern, mainPageView.i.d_route);
connect(mainPageVm.o.d_vm, mainPageView.i.d_vm);
connect(parentDemuxer.o.ev_dom_ready, mainPageVm.i.ev_ready);

// setting up pre-rendering
const ticker = createTicker(10, true);
const flameBuffer = createFlameBuffer();
const pathNormalizer = createMapper(normalizePaths);
connect(mainPageView.o.d_view, pathNormalizer.i.d_val);
connect(pathNormalizer.o.d_val, flameBuffer.i.d_val);
connect(ticker.o.ev_tick, flameBuffer.i.a_res);
connect(flameBuffer.o.d_val, parentMuxer.i.d_out);

// model for model test with list with references
// TODO: Move to model node
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

// setting up routing table
connect(router.o[`r_${ROUTE_MODEL_TEST_1}`], userSampler.i.d_val);
