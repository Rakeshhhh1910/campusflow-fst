/**
 * app/api/auth/[...betterauth]/route.ts
 * Better Auth catch-all route handler.
 * Handles all authentication requests (signin, signout, session, etc.)
 */

import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
