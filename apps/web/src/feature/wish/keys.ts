export const wishKeys = {
  all: ["wish"] as const,
  lists: () => ["wish", "list"] as const,
  ids: () => ["wish", "ids"] as const,
};
