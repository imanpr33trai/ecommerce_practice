export const orderKeys = {
  all: ["order"] as const,
  lists: () => ["order", "list"] as const,
  detail: (id: string) => ["order", "detail", id] as const,
};
