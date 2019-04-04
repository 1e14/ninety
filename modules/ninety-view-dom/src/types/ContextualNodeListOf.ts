/**
 * Extends NodeList with a context, specifying the node it belongs to.
 */
export type ContextualNodeListOf<T extends Node> = NodeListOf<T> & {
  context: Node
};
