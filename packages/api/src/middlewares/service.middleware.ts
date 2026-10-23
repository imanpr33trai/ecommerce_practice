import type { Context, Next } from "hono";

import { PrismaUserRepository } from "../repositories/prisma/user.repository.js";
import { UserService } from "../services/UserService.js";
import type { HonoEnv } from "../context.js";

/**
 * Middleware to inject UserService into the Hono context
 * Creates PrismaUserRepository and UserService instances per request
 */
export async function serviceMiddleware(c: Context<HonoEnv>, next: Next) {
  const userRepository = new PrismaUserRepository();
  const userService = new UserService(userRepository);

  c.set("userService", userService);

  await next();
}
