import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  HOST: z.string().nonempty().default("localhost"),
  PORT: z.coerce.number().int().positive().default(3000),
  EMAIL: z.string().nonempty().email(),
  URL: z.string().nonempty().url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.format(), null, 4),
  );
  process.exit(1);
}

export default parsed.data;
