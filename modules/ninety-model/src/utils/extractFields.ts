import {IdList, Model, ReferenceTypes} from "../types";

/**
 * Creates a mapper function that extracts references a model according to
 * the specified reference config.
 * @param model Model to extract fields from.
 * @param config Defines which fields correspond to references of a
 * certain (model) type.
 */
export function extractFields(
  model: Model,
  config: ReferenceTypes
): { [type: string]: IdList } {
  const result = {};
  for (const id in model) {
    const entry = model[id];
    for (const field in config) {
      if (field in entry) {
        const type = config[field];
        const ids = result[type] || (result[type] = []);
        ids.push(entry[field]);
      }
    }
  }
  return result;
}
