module.exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.flash('error', 'Please login first to access this page');
  res.redirect('/login');
};

module.exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.role === 'admin') {
    return next();
  }
  req.flash('error', 'Access denied. Admin privileges required.');
  res.redirect('/');
};