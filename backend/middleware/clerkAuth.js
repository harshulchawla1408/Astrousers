// Temporary auth bypass middleware used until Clerk integration is restored.
// It simply pulls a clerk/user id from headers or request payload so downstream
// handlers continue to receive req.userId without enforcing JWT verification.
export const requireAuth = (req, res, next) => {
  const userId =
    req.header("x-user-id") ||
    req.body?.clerkId ||
    req.query?.clerkId ||
    req.params?.clerkId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User identifier missing. Provide x-user-id header or clerkId."
    });
  }

  req.userId = userId;
  next();
};

