import {connect, Node, OutPorts} from "1e14";
import {createSplitter} from "1e14-flow";
import {createMapper} from "1e14-fp";
import {IdList, Model, ReferenceFieldTypes} from "../types";
import {extractFields} from "../utils/extractFields";

export type In = {
  /** Model from which references to be extracted. */
  d_model: Model
};

export type Out<T extends ReferenceFieldTypes> = {
  [type in T[keyof T]]: IdList;
};

/**
 * Extracts references from a model that match the specified field/type
 * associations.
 * The output(s) of a ReferenceExtractor may be used to sample Stores of
 * matching type.
 */
export type ReferenceExtractor<T extends ReferenceFieldTypes> = Node<In, Out<T>>;

/**
 * Creates a ReferenceExtractor node.
 * @param config Specifies reference field/type associations for the current
 * model.
 */
export function createReferenceExtractor<T extends ReferenceFieldTypes>(
  config: T
): ReferenceExtractor<T> {
  const referenceTypes = getReferenceTypes(config);
  const fieldExtractor = createMapper<Model, { [type: string]: IdList }>((value) => {
    return extractFields(value, config);
  });
  const splitter = createSplitter<{ [type in keyof T]: IdList }>(referenceTypes);

  connect(fieldExtractor.o.d_val, splitter.i.all);

  const i = {
    d_model: fieldExtractor.i.d_val
  };

  const o = <OutPorts<Out<T>>>{};
  for (let j = 0, count = referenceTypes.length; j < count; j++) {
    const port = referenceTypes[j];
    o[port] = splitter.o[port];
  }

  return {i, o};
}

/**
 * Extracts list of reference types from reference field/type
 * associations.
 * @param config Reference field/type associations.
 */
function getReferenceTypes<T extends ReferenceFieldTypes>(
  config: T
): Array<T[keyof T]> {
  const result = [];
  for (const field in config) {
    result.push(config[field]);
  }
  return result;
}
