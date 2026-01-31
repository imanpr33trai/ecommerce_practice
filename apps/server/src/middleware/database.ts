// import getDatabase from "@ecomerceNextjs/db";
// import type { MiddlewareHandler } from "hono";

// export const databaseMiddleware: MiddlewareHandler = async (c, next) => {
//   try {
//     const db = getDatabase();
//     c.set("db", db);
//     await next();
//   } catch (error) {
//     return c.json(
//       {
//         error: "Database connection failed",
//         status: 500,
//       },
//       500,
//     );
//   }
// };
