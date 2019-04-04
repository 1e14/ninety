import {connect} from "1e14";
import {createDomTableCellView, DomTableCellView} from "./DomTableCellView";

describe("createDomTableCellView()", () => {
  describe("on input (d_view)", () => {
    let node: DomTableCellView;

    beforeEach(() => {
      node = createDomTableCellView(1);
    });

    it("should emit on 'd_view'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_view, spy);
      node.i.d_view({
        del: {
          "foo.1,3.bar": null
        },
        set: {
          "foo.1,3.bar": "baz"
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        del: {
          "foo.childNodes,1:TR,childNodes,3:TD.bar": null
        },
        set: {
          "foo.childNodes,1:TR,childNodes,3:TD.bar": "baz"
        }
      }, "1");
    });
  });
});
