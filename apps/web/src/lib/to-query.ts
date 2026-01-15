type QueryValue = string | string[] | undefined;

export function toQuery<T extends Record<string, any>>(
  filters: Partial<T>,
): Record<string, QueryValue> {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, v]) => v !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, value];
        }
        if (typeof value === "boolean") {
          return [key, value.toString()];
        }
        if (typeof value === "number") {
          return [key, value.toString()];
        }
        return [key, value];
      }),
  );
}
