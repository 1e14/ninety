import {Flame} from "../../flame/types";
import {fetchDomParent} from "./fetchDomParent";

describe("fetchDomParent()", () => {
  const window = <any>global;

  beforeEach(() => {
    window.Attr = function () {//
    };
    window.Comment = function () {
      this.parentNode = null;
    };
    window.Text = function () {
      this.parentNode = null;
    };
    window.CSSStyleDeclaration = function () {//
    };
    window.DOMTokenList = function () {
      this._items = {};
    };
    window.DOMTokenList.prototype = {
      add(name) {
        this._items[name] = name;
      },
      contains(name) {
        return this._items[name] !== undefined;
      },
      remove(name) {
        delete this._items[name];
      }
    };
    window.NamedNodeMap = function () {
      this._items = {};
    };
    window.NamedNodeMap.prototype = {
      getNamedItem(name) {
        return this._items[name];
      },
      removeNamedItem(name) {
        delete this._items[name];
      },
      setNamedItem(attr) {
        this._items[attr.name] = attr;
      }
    };
    window.Node = function () {
      this.childNodes = new window.NodeList();
      this.attributes = new window.NamedNodeMap();
      this.classList = new window.DOMTokenList();
      this.style = new window.CSSStyleDeclaration();
      this.parentNode = null;
    };
    window.Node.prototype = {
      appendChild(newChild: Node) {
        this.childNodes[this.childNodes.length++] = newChild;
        (<any>newChild).parentNode = this;
      },
      replaceChild(newChild, oldChild) {
        for (let i = 0; i < this.childNodes.length; i++) {
          if (this.childNodes[i] === oldChild) {
            this.childNodes[i] = newChild;
            (<any>newChild).parentNode = this;
            break;
          }
        }
      }
    };
    window.NodeList = function () {
      this.length = 0;
    };
    window.document = new Node();
    window.document.body = new window.Node();
    window.document.createAttribute = (name) => {
      const attr = new window.Attr();
      attr.name = name;
      return attr;
    };
    window.document.createComment = (data) => {
      const comment = new window.Comment();
      comment.data = data;
      return comment;
    };
    window.document.createElement = (tagName) => {
      const node = new window.Node();
      node.tagName = tagName;
      return node;
    };
  });

  afterEach(() => {
    delete window.Attr;
    delete window.Comment;
    delete window.CSSStyleDeclaration;
    delete window.DOMTokenList;
    delete window.NamedNodeMap;
    delete window.Node;
    delete window.NodeList;
    delete window.document;
  });

  it("should build DOM tree", () => {
    const cache = {"": window.document};
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    fetchDomParent(cache, path);
    expect(window.document.body.childNodes[1].tagName).toBe("div");
    expect(window.document.body.childNodes[1].childNodes[3].tagName)
    .toBe("span");
  });

  it("should add placeholders along the way", () => {
    const cache = {"": window.document};
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    fetchDomParent(cache, path);
    expect(window.document.body.childNodes[0].data).toBe("");
    expect(window.document.body.childNodes[1].childNodes[0].data).toBe("");
    expect(window.document.body.childNodes[1].childNodes[1].data).toBe("");
    expect(window.document.body.childNodes[1].childNodes[2].data).toBe("");
  });

  it("should return DOM parent", () => {
    const cache = {"": window.document};
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    const result = fetchDomParent(cache, path);
    expect(result).toBe(window.document.body.childNodes[1].childNodes[3].classList);
  });

  it("should build cache", () => {
    const cache = {"": window.document};
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    fetchDomParent(cache, path);
    expect(cache[""].body.childNodes[1].tagName).toBe("div");
    expect(cache[""].body.childNodes[1].childNodes[3].tagName)
    .toBe("span");
    expect(cache[""].body.childNodes[1].childNodes[3].classList)
    .toEqual(new window.DOMTokenList());
    expect(cache["body."].childNodes[1].tagName).toBe("div");
    expect(cache["body."].childNodes[1].childNodes[3].tagName)
    .toBe("span");
    expect(cache["body."].childNodes[1].childNodes[3].classList)
    .toEqual(new window.DOMTokenList());
    expect(cache["body.childNodes.1:div."].tagName).toBe("div");
    expect(cache["body.childNodes.1:div."].childNodes[3].tagName)
    .toBe("span");
    expect(cache["body.childNodes.1:div."].childNodes[3].classList)
    .toEqual(new window.DOMTokenList());
    expect(cache["body.childNodes.1:div.childNodes.3:span."].tagName)
    .toBe("span");
    expect(cache["body.childNodes.1:div.childNodes.3:span."].classList)
    .toEqual(new window.DOMTokenList());
  });

  describe("when comments are in the way", () => {
    let cache: Flame;

    beforeEach(() => {
      cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      fetchDomParent(cache, path);
    });

    it("should replace comments with nodes", () => {
      const path = "body.childNodes.0:span.innerText";
      fetchDomParent(cache, path);
      expect(window.document.body.childNodes[0].tagName).toBe("span");
    });
  });

  describe("when DOM tree already built", () => {
    beforeEach(() => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      fetchDomParent(cache, path);
    });

    it("should build cache", () => {//
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      fetchDomParent(cache, path);
      expect(cache[""].body.childNodes[1].tagName).toBe("div");
      expect(cache[""].body.childNodes[1].childNodes[3].tagName)
      .toBe("span");
      expect(cache[""].body.childNodes[1].childNodes[3].classList)
      .toEqual(new window.DOMTokenList());
      expect(cache["body."].childNodes[1].tagName).toBe("div");
      expect(cache["body."].childNodes[1].childNodes[3].tagName)
      .toBe("span");
      expect(cache["body."].childNodes[1].childNodes[3].classList)
      .toEqual(new window.DOMTokenList());
      expect(cache["body.childNodes.1:div."].tagName).toBe("div");
      expect(cache["body.childNodes.1:div."].childNodes[3].tagName)
      .toBe("span");
      expect(cache["body.childNodes.1:div."].childNodes[3].classList)
      .toEqual(new window.DOMTokenList());
      expect(cache["body.childNodes.1:div.childNodes.3:span."].tagName)
      .toBe("span");
      expect(cache["body.childNodes.1:div.childNodes.3:span."].classList)
      .toEqual(new window.DOMTokenList());
    });
  });
});
