import {FlamesByModelType, Model, Models, ReferenceConfig} from "../types";

/**
 * Expands model references, substituting references with referred model
 * entries.
 * @param models All affected model entries, indexed by type, then id.
 * @param config Configuration of expanding references. In each affected host
 * type, assigns a referred type to expanding reference fields.
 */
export function expandModel<T extends FlamesByModelType>(
  models: Models<T[keyof T]>,
  config: ReferenceConfig<T>
): any {
  const expand = (model: Model<T[keyof T]>, references?): any => {
    let result: any;
    if (typeof references === "string") {
      // collection with ID fields
      result = {};
      for (const id in model) {
        const originalEntry = model[id];
        let expandedEntry: any = result[id];
        if (!expandedEntry) {
          expandedEntry = result[id] = {};
        }
        for (const field in originalEntry) {
          const type = references;
          const referredId = originalEntry[field];
          const referredModel = models[type];
          const referredEntry = referredModel && referredModel[referredId];
          if (referredEntry) {
            expandedEntry[field] = expand(
              {[referredId]: <T[keyof T]>referredEntry},
              config[type]
            )[referredId];
          } else {
            expandedEntry[field] = null;
          }
        }
      }
    } else if (references) {
      // document with named fields
      result = {};
      for (const id in model) {
        const entryIn = model[id];
        let entryOut = result[id];
        if (!entryOut) {
          entryOut = result[id] = <T[keyof T]>{};
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
              entryOut[field] = expand(
                {[referredId]: <T[keyof T]>referredEntry},
                config[type]
              )[referredId];
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
