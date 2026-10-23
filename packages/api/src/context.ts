import type { Session } from "@ecommerceNextjs/auth";

import type { UserService } from "./services/UserService.js";
import type { DIContainer } from "./di/container.js";

// Define the Hono Environment Type
export type HonoEnv = {
  Variables: {
    user: Session["user"];
    session: Session["session"];
    userService: UserService;
    container: DIContainer;
  };
};
