function secureRoute(req, res, next) {
  if(!req.session.userId) {
    return req.session.regenerate(() => res.redirect('/login'));
  }
  next();
}

module.exports = secureRoute;
