import { env } from "@ecomerceNextjs/env";
import { serve } from "@hono/node-server";

import app from "./app";

const port = Number(env.PORT) || 3000;

serve({
  fetch: app.fetch,
  port,
});
