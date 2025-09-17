/**
 * Middleware to authorize user access based on their role.
 *
 * Usage:
 * - Pass one or more allowed roles as arguments (e.g., authorizeRoles('commander', 'commando')).
 * - The middleware checks if the authenticated user's role (from req.user) is included in the allowed roles.
 * - If the user's role is not allowed or missing, responds with 403 Forbidden.
 * - Otherwise, calls next() to proceed to the next middleware or route handler.
 *
 * This middleware should be used after authentication middleware.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Get the user's role from the authenticated user object (set by auth middleware)
    const userRole = req.user?.role

    // Check if the user's role exists and is included in the allowed roles
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' })
    }

    // User has the required role, proceed to the next middleware or route handler
    next()
  }
}

module.exports = {
  authorizeRoles
}
