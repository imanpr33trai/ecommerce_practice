export const cartKeys = {
  all: ["cart"] as const,
  // The main key used for fetching the user's cart
  detail: () => ["cart", "detail"] as const,

  userCart: () => ["cart", "list"],
};
