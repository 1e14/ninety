import {createFlameThrottler} from "flamejet";
import {connect} from "flowcode";
import {createMapper} from "flowcode-fp";
import {createDemuxer, createMuxer} from "flowcode-mux";
import {createDomReadyNotifier} from "ninety-dom";
import {createLocationHash} from "ninety-location";
import {createFrameRenderer} from "ninety-view-dom";
import {createWorkerThread} from "ninety-webworker";

// setting up threading
const workerThread = createWorkerThread("worker.js");
const workerMuxer = createMuxer(["ev_dom_ready", "d_hash_path"]);
const workerDemuxer = createDemuxer(["d_out"]);
connect(workerThread.o.d_msg, workerDemuxer.i.d_mux);
connect(workerMuxer.o.d_mux, workerThread.i.d_msg);

// setting up bootstrapper
const domReadyNotifier = createDomReadyNotifier();
connect(domReadyNotifier.o.ev_ready, workerMuxer.i.ev_dom_ready);

// setting up hash-based routing
const locationHash = createLocationHash();
const hash2Path = createMapper<string, string>((hash) => hash.substr(1));
connect(locationHash.o.d_val, hash2Path.i.d_val);
connect(hash2Path.o.d_val, workerMuxer.i.d_hash_path);

// setting up rendering engine
const MIN_SCRIPT_DURATION = 4; // [ms]
const MAX_SCRIPT_DURATION = 7; // [ms]
const FRAME_STEP_RATIO = 1.1;
let fs = 768;
const viewThrottler = createFlameThrottler(fs);
const frameRenderer = createFrameRenderer();
const frameSizeAdjuster = createMapper<number, number>((value) => {
  if (value > MAX_SCRIPT_DURATION) {
    fs = Math.floor(fs / FRAME_STEP_RATIO);
  } else if (value < MIN_SCRIPT_DURATION) {
    fs = Math.floor(fs * FRAME_STEP_RATIO);
  }
  return fs;
});
connect(viewThrottler.o.d_val, frameRenderer.i.d_frame);
connect(viewThrottler.o.ev_load, viewThrottler.i.a_next);
connect(frameRenderer.o.d_dur, viewThrottler.i.a_next);
connect(frameRenderer.o.d_dur, frameSizeAdjuster.i.d_val);
connect(frameSizeAdjuster.o.d_val, viewThrottler.i.d_fs);
connect(workerDemuxer.o.d_out, viewThrottler.i.d_val);
