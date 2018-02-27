const User = require('../models/user');
const Dance = require('../models/dance');

function newRoute(req, res) {
  res.render('registrations/new');
}

function createRoute(req, res, next) {
  User.create(req.body)
    .then(() => res.redirect('/dances'))
    .catch(next);
}

function profileRoute(req, res) {
  Dance.find()
    .then(dances => res.render('registrations/profile', { dances }));
}

module.exports = {
  new: newRoute,
  create: createRoute,
  profile: profileRoute
};
