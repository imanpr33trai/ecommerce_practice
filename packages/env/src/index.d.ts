import "dotenv/config";
import { z } from "zod";
export declare const envSchema: z.ZodObject<{
    DATABASE_URL: z.ZodString;
    NEXT_PUBLIC_SERVER_URL: z.ZodString;
    BETTER_AUTH_URL: z.ZodString;
    CORS_ORIGIN: z.ZodString;
    BETTER_AUTH_SECRET: z.ZodString;
}, z.core.$strip>;
export declare function getEnv(): {
    DATABASE_URL: string;
    NEXT_PUBLIC_SERVER_URL: string;
    BETTER_AUTH_URL: string;
    CORS_ORIGIN: string;
    BETTER_AUTH_SECRET: string;
};
//# sourceMappingURL=index.d.ts.map