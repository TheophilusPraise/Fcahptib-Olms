// middleware/auth.js

export function ensureAuthenticated(req, res, next) {
  if (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (typeof req.isAuthenticated !== 'function' || !req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized: Please log in.' });
    }
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied.' });
    }
    next();
  };
}
