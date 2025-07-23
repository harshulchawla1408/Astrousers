import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]";

/**
 * Get current session data (used in server components or API routes)
 */
export const getSession = async () => {
  return await getServerSession(authOptions);
};

/**
 * Protect server-side routes
 * Use in middleware, pages, API routes that require login
 */
export const requireAuth = async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
};
