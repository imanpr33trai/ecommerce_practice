export const accountKeys = {
  all: ["account"] as const,
  addresslist: ["account", "addresses", "list"] as const,
  profile: () => ["account", "profile"] as const,
};
