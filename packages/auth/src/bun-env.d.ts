declare module "bun" {
    interface Env {
        DATABASE_URL: string;
        BETTER_AUTH_SECRET: string;
        NEXT_PUBLIC_API_URL: string;
        BETTER_AUTH_URL: string;
        CORS_ORIGIN: string;
        // add more here
    }
}

export { };
