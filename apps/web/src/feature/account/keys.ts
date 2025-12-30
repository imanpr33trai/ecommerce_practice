export const accountKeys = {
  all: ["account"] as const,
  profile: () => ["account", "profile"] as const,
  addresses: () => ["account", "addresses"] as const,
};
