import type { Session } from "@ecomerceNextjs/auth"; // Your auth package

// Define the Hono Environment Type
export type HonoEnv = {
  Variables: {
    user: Session["user"];
    session: Session["session"];
  };
};
