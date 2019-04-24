/**
 * Associates model types to reference fields of a model.
 * @example
 * { author: "Author", publisher: "Publisher" }
 * // lowercase: field
 * // capitalized: model type
 */
export type ReferenceTypes = {
  [field: string]: string
};
