export function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/auth/login');
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).send('Access denied');
    }
    next();
  };
}
