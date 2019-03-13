import {Diff} from "gravel-core";
import {createView, ViewIn, ViewOut} from "gravel-view";
import {createDomEventView, createDomTextView} from "gravel-view-dom-lib";
import {Any, connect, Node} from "river-core";
import {createMapper} from "river-stdlib";
import {generateTableData} from "../utils";
import {createSimpleTableView} from "./SimpleTableView";
import {createTicker} from "./Ticker";

export type In = ViewIn<{}> & {
  st_active: boolean;
};

export type AnimatedTablePageView = Node<In, ViewOut>;

export function createAnimatedTablePageView(path: string = ""): AnimatedTablePageView {
  const tableTicker = createTicker(100);
  const tableSource = createMapper<any, Diff<Any>>(() => {
    return generateTableData(30, 30);
  });
  const textStartSource = createMapper(() => ({
    del: {},
    set: {
      content: "Start"
    }
  }));
  const textStartView = createDomTextView(
    "childNodes.0:div.childNodes.0:button");
  const clickStartView = createDomEventView(
    "childNodes.0:div.childNodes.0:button",
    "onclick");
  const clickStartMapper = createMapper(() => true);
  const textStopSource = createMapper(() => ({
    del: {},
    set: {
      content: "Stop"
    }
  }));
  const textStopView = createDomTextView(
    "childNodes.0:div.childNodes.1:button");

  connect(textStartSource.o.d_val, textStartView.i.vm_diff);
  connect(textStopSource.o.d_val, textStopView.i.vm_diff);
  connect(textStartView.o.ev_smp, textStartSource.i.d_val);
  connect(textStopView.o.ev_smp, textStopSource.i.d_val);

  const clickStopView = createDomEventView(
    "childNodes.0:div.childNodes.1:button",
    "onclick");
  const clickStopMapper = createMapper(() => false);
  const tablePath = new Array(10).join("childNodes.0:div.");
  const tableView = createSimpleTableView(
    `childNodes.1:div.${tablePath}childNodes.0:table`);
  const view = createView<{}>(path, () => ({del: {}, set: {}}));

  connect(tableTicker.o.ev_tick, tableSource.i.d_val);
  connect(tableSource.o.d_val, tableView.i.vm_diff);
  connect(clickStartView.o.d_event, clickStartMapper.i.d_val);
  connect(clickStartMapper.o.d_val, tableTicker.i.st_active);
  connect(clickStopView.o.d_event, clickStopMapper.i.d_val);
  connect(clickStopMapper.o.d_val, tableTicker.i.st_active);

  connect(textStartView.o.v_diff, view.i.v_diff);
  connect(clickStartView.o.v_diff, view.i.v_diff);
  connect(textStopView.o.v_diff, view.i.v_diff);
  connect(clickStopView.o.v_diff, view.i.v_diff);
  connect(tableView.o.v_diff, view.i.v_diff);

  connect(view.o.ev_smp, textStartView.i.ev_smp);
  connect(view.o.ev_smp, clickStartView.i.ev_smp);
  connect(view.o.ev_smp, textStopView.i.ev_smp);
  connect(view.o.ev_smp, clickStopView.i.ev_smp);
  connect(view.o.ev_smp, tableView.i.ev_smp);
  connect(view.o.ev_smp, tableSource.i.d_val);

  return {
    i: {
      ev_smp: view.i.ev_smp,
      st_active: tableTicker.i.st_active,
      v_diff: view.i.v_diff,
      vm_diff: view.i.vm_diff
    },

    o: {
      ev_smp: view.o.ev_smp,
      v_diff: view.o.v_diff
    }
  };
}
