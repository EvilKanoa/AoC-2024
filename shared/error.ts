/**
 * Generates a thrown error from the function call site. Can be used to throw
 * errors during optional chaining or other semi (lol) functional code.
 */
export const error = <T = void>(message?: string, options?: ErrorOptions): T => {
  throw new Error(message, options);
};
