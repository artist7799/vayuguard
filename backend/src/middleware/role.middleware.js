/**
 * Role Authorization Middleware Factory
 * Restricts route access to users with specified role(s).
 * @param {...string} allowedRoles - Allowed roles (e.g. 'ADMIN', 'USER')
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required before role verification',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this resource',
      });
    }

    next();
  };
}

module.exports = {
  requireRole,
};
