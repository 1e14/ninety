import {connect} from "1e14";
import {createMapper} from "1e14-fp";
import {createDemuxer, createMuxer} from "1e14-mux";
import {createDomReadyNotifier} from "ninety-dom";
import {createLocationHash} from "ninety-location";
import {createFrameQueue, createFrameRenderer} from "ninety-view-dom";
import {createWorkerThread} from "ninety-webworker";

// setting up threading
const workerThread = createWorkerThread("worker.js");
const workerMuxer = createMuxer(["ev_dom_ready", "d_hash_path"]);
const workerDemuxer = createDemuxer(["d_view"]);
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
const frameQueue = createFrameQueue(fs);
const frameRenderer = createFrameRenderer();
const frameSizeAdjuster = createMapper<number, number>((value) => {
  if (value > MAX_SCRIPT_DURATION) {
    fs = Math.floor(fs / FRAME_STEP_RATIO);
  } else if (value < MIN_SCRIPT_DURATION) {
    fs = Math.floor(fs * FRAME_STEP_RATIO);
  }
  return fs;
});

connect(frameQueue.o.d_frame, frameRenderer.i.d_frame);
connect(frameQueue.o.ev_load, frameQueue.i.ev_next);
connect(frameRenderer.o.d_dur, frameQueue.i.ev_next);
connect(frameRenderer.o.d_dur, frameSizeAdjuster.i.d_val);
connect(frameSizeAdjuster.o.d_val, frameQueue.i.d_fs);
connect(workerDemuxer.o.d_view, frameQueue.i.d_view);
