type WithoutUndefinedValues<T> = {
  [K in keyof T]?: Exclude<T[K], undefined>;
};

export function removeUndefined<T extends Record<string, unknown>>(
  obj: T,
): WithoutUndefinedValues<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as WithoutUndefinedValues<T>;
}
