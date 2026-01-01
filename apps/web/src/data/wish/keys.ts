export const wishKeys = {
  all: ["wish"] as const,
  lists: () => ["wish", "list"] as const,
  ids: (id: string) => ["wish", "ids", id] as const,
};
