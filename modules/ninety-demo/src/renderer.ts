import {connect} from "1e14";
import {createMapper} from "1e14-fp";
import {createDemuxer, createMuxer} from "1e14-mux";
import {createTicker} from "1e14-time";
import {createDiffBuffer, FlameDiff} from "flamejet";
import {createDomReadyNotifier} from "ninety-dom";
import {createLocationHash} from "ninety-location";
import {createDomDiffApplier} from "ninety-view-dom";
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
// flushes diff buffer to renderer every 10ms
const ticker = createTicker(10, true);
const viewBuffer = createDiffBuffer();
// TODO: Move out to a node.
const pathNormalizer = createMapper<FlameDiff, FlameDiff>((diff) => {
  const set = {};
  const del = {};
  const viewSet = diff.set;
  const viewDel = diff.del;
  for (const path in viewSet) {
    set[path.replace(/,/g, ".")] = viewSet[path];
  }
  for (const path in viewDel) {
    del[path.replace(/,/g, ".")] = null;
  }
  return {set, del};
});
const domDiffApplier = createDomDiffApplier();
connect(workerDemuxer.o.d_view, viewBuffer.i.d_diff);
connect(viewBuffer.o.d_diff, pathNormalizer.i.d_val);
connect(pathNormalizer.o.d_val, domDiffApplier.i.d_diff);
connect(ticker.o.ev_tick, viewBuffer.i.ev_res);
