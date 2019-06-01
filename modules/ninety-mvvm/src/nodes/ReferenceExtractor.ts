import {Flame} from "flamejet/dist/types";
import {connect, Node, OutPorts} from "flowcode";
import {createSplitter} from "flowcode-flow";
import {createMapper} from "flowcode-fp";
import {IdList, IdListsByModelType, Model, ReferenceTypes} from "../types";
import {extractFields} from "../utils/extractFields";

export type In<S extends Flame> = {
  /** Model from which references to be extracted. */
  d_model: Model<S>
};

export type Out<S extends Flame, R extends ReferenceTypes<S>> =
  IdListsByModelType<R[keyof R]>;

/**
 * Extracts references from a model that match the specified reference
 * field/type associations.
 * The output(s) of a ReferenceExtractor may be used to sample Stores of
 * matching type.
 * Type parameter S describes the model schema, R describes the reference
 * field/type associations.
 */
export type ReferenceExtractor<S extends Flame,
  R extends ReferenceTypes<S>> = Node<In<S>, Out<S, R>>;

/**
 * Creates a ReferenceExtractor node.
 * Type parameter S describes the model schema, R describes the reference
 * field/type associations.
 * @param config Specifies reference field/type associations for the current
 * model.
 */
export function createReferenceExtractor<S extends Flame,
  R extends ReferenceTypes<S>>(
  config: R
): ReferenceExtractor<S, R> {
  const referenceTypes = getReferenceTypes(config);
  const fieldExtractor = createMapper<Model<S>, { [type: string]: IdList }>((value) => {
    return extractFields(value, config);
  });
  const splitter = createSplitter<{ [type in keyof R]: IdList }>(referenceTypes);
  const sanitizers = referenceTypes.map(
    () => createMapper((ids) => ids || []));

  connect(fieldExtractor.o.d_val, splitter.i.all);
  for (let j = 0, count = referenceTypes.length; j < count; j++) {
    const port = referenceTypes[j];
    connect(splitter.o[port], sanitizers[j].i.d_val);
  }

  const i = {
    d_model: fieldExtractor.i.d_val
  };

  const o = <OutPorts<Out<S, R>>>{};
  for (let j = 0, count = referenceTypes.length; j < count; j++) {
    const port = referenceTypes[j];
    o[port] = sanitizers[j].o.d_val;
  }

  return {i, o};
}

/**
 * Extracts list of reference types from reference field/type
 * associations.
 * @param config Reference field/type associations.
 */
function getReferenceTypes<S extends Flame, R extends ReferenceTypes<S>>(
  config: R
): Array<R[keyof R]> {
  const result = [];
  for (const field in config) {
    result.push(config[field]);
  }
  return result;
}
