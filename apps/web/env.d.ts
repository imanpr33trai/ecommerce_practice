declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      BETTER_AUTH_URL: string;
      DATABASE_URL: string;
      NODE_ENV: "development" | "production" | "test";
    }
  }
}

// If this file has no imports/exports, add an empty export to make it a module
export { };
