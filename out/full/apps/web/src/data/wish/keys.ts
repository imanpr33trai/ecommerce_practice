export const wishKeys = {
  all: ["wish"] as const,
  count: () => ["wish", "count"] as const,
  ids: () => ["wish", "ids"] as const,

  user: () => ["wish", "user"] as const,
};
