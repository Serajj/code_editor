const checkRole = (requiredRole) => (req, res, next) => {
    const userRole = req.user.role;
  
    if (userRole === requiredRole) {
      next();
    } else {
      res.status(403).json({ message: 'Unauthorized, only admin access this route.' });
    }
  };
  
  module.exports = checkRole;
  