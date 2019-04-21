import {Flame} from "flamejet";
import {ModelBuffer} from "../types";

/**
 * Expands model references, substituting references with referred model
 * entries.
 * @param models All referenced models.
 * @param config Defines expanding references.
 */
export function expandModel(
  models: { [port: string]: ModelBuffer<Flame> },
  config: { [port: string]: { [field: string]: any } }
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
            const port = references[field];
            const referredId = entryIn[field];
            const referredModel = models[port];
            const referredEntry = referredModel && referredModel[referredId];
            if (referredEntry) {
              entryOut[field] = expand({[referredId]: referredEntry}, config[port])[referredId];
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
