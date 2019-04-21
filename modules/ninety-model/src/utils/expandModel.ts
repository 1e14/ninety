import {Flame} from "flamejet";
import {ModelBuffer} from "../types";

/**
 * Expands model references, substituting references with referred model
 * entries.
 * @param models All affected model entries, indexed by type, then id.
 * @param config Configuration of expanding references. In each affected host
 * type, assigns a referred type to expanding reference fields.
 */
export function expandModel<T extends { [type: string]: Flame }>(
  models: { [type in keyof T]: ModelBuffer<T[type]> },
  config: { [type in keyof T]?: { [field in keyof T[type]]?: keyof T } }
): ModelBuffer<Flame> {
  const expand = (model: ModelBuffer<Flame>, references?): ModelBuffer<Flame> => {
    let result: ModelBuffer<Flame>;
    if (references) {
      // model has expanding references defined
      result = {};
      // walking through entries in model and expanding references
      for (const id in model) {
        const entryIn = model[id];
        let entryOut = result[id];
        if (!entryOut) {
          entryOut = result[id] = {};
        }
        for (const field in entryIn) {
          if (field in references) {
            // field is an expanding reference
            // assigning (expanded) referred model entry
            const type = references[field];
            const referredId = entryIn[field];
            const referredModel = models[type];
            const referredEntry = referredModel && referredModel[referredId];
            if (referredEntry) {
              entryOut[field] = expand({[referredId]: referredEntry}, config[type])[referredId];
            } else {
              entryOut[field] = null;
            }
          } else {
            // field is not an expanding reference
            // copying value
            entryOut[field] = entryIn[field];
          }
        }
      }
    } else {
      // model has no expanding references
      // nothing to expand
      result = model;
    }
    return result;
  };
  return expand(models.d_model, config.d_model);
}
