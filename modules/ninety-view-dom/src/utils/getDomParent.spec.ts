import {fetchDomParent} from "./fetchDomParent";
import {getDomParent} from "./getDomParent";

describe("getDomParent()", () => {
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
    window.Element = function () {
      window.Node.call(this);
      this.attributes = new window.NamedNodeMap();
      this.classList = new window.DOMTokenList();
    };
    window.Element.prototype = Object.create(window.Node.prototype);
    window.HTMLElement = function () {
      window.Element.call(this);
      this.style = new window.CSSStyleDeclaration();
    };
    window.HTMLElement.prototype = Object.create(window.Element.prototype);
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
      const node = new window.HTMLElement();
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
    delete window.Element;
    delete window.HTMLElement;
    delete window.document;
  });

  describe("when path exists", () => {
    beforeEach(() => {
      const stack = [window.document.body];
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      fetchDomParent(stack, path);
    });

    it("should return DOM parent", () => {
      const stack = [window.document.body];
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      const result = getDomParent(stack, path);
      expect(result).toBe(window.document.body.childNodes[1].childNodes[3].classList);
    });

    it("should build stack", () => {
      const stack = [window.document.body];
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      getDomParent(stack, path);
      expect(stack).toEqual([
        window.document.body,
        window.document.body.childNodes,
        window.document.body.childNodes[1],
        window.document.body.childNodes[1].childNodes,
        window.document.body.childNodes[1].childNodes[3],
        window.document.body.childNodes[1].childNodes[3].classList
      ]);
    });
  });

  describe("when path does not exist", () => {
    it("should return undefined", () => {
      const stack = [window.document.body];
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      const result = getDomParent(stack, path);
      expect(result).toBeUndefined();
    });
  });

  describe("when partial path exists", () => {
    beforeEach(() => {
      const stack = [window.document.body];
      const path = "body.childNodes.1:div.classList.foo";
      fetchDomParent(stack, path);
    });

    it("should return undefined", () => {
      const stack = [window.document.body];
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      const result = getDomParent(stack, path);
      expect(result).toBeUndefined();
    });

    it("should build partial stack", () => {
      const stack = [window.document.body];
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      getDomParent(stack, path);
      expect(stack).toEqual([
        window.document.body,
        window.document.body.childNodes,
        window.document.body.childNodes[1],
        window.document.body.childNodes[1].childNodes
      ]);
    });
  });
});
