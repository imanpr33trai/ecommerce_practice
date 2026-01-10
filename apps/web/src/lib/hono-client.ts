import { hc } from "hono/client";

import type { AppType } from "../../../server/src";

export const client = hc<AppType>("http://localhost:3000");
