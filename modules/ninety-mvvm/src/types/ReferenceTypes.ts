import {Flame} from "flamejet";

/**
 * Associates model types to reference fields of a model.
 * Type parameter S describes the model schema.
 * @example
 * { author: "Author", publisher: "Publisher" }
 * // lowercase: field
 * // capitalized: model type
 */
export type ReferenceTypes<S extends Flame> = Partial<{
  [field in keyof S]: string
}>;
