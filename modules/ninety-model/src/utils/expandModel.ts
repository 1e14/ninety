import {Model, Models, ReferenceConfig} from "../types";

/**
 * Expands model references, substituting references with referred model
 * entries.
 * @param models All affected model entries, indexed by type, then id.
 * @param config Configuration of expanding references. In each affected host
 * type, assigns a referred type to expanding reference fields.
 */
export function expandModel<T extends Models>(
  models: { [type in keyof T]: Model<T[type]> },
  config: ReferenceConfig<T>
): Model<T[keyof T]> {
  const expand = <K extends keyof T>(
    model: Model<T[K][keyof T[K]]>,
    references?
  ): Model<T[K][keyof T[K]]> => {
    /** Current model schema. */
    type S = T[K][keyof T[K]];
    let result: Model<S>;
    if (typeof references === "string") {
      // collection with ID fields
      result = {};
      for (const id in model) {
        const entryIn = model[id];
        let entryOut = result[id];
        if (!entryOut) {
          entryOut = result[id] = <S>{};
        }
        for (const field in entryIn) {
          const type = references;
          const referredId = entryIn[field];
          const referredModel = models[type];
          const referredEntry = referredModel && referredModel[referredId];
          if (referredEntry) {
            entryOut[field] = expand(
              <T[any]>{[referredId]: referredEntry},
              config[type]
            )[referredId];
          } else {
            entryOut[field] = null;
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
          entryOut = result[id] = <S>{};
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
                <T[any]>{[referredId]: referredEntry},
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
  return expand(<T["d_models"]>models.d_model, config.d_model);
}
