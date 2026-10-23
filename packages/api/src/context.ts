import type { Session } from "@ecommerceNextjs/auth";

import type { UserService } from "./services/UserService.js";

// Define the Hono Environment Type
export type HonoEnv = {
  Variables: {
    user: Session["user"];
    session: Session["session"];
    userService: UserService;
  };
};
