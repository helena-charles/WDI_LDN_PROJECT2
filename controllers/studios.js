const studio = require('../models/studio');

function indexRoute(req, res) {
  studio.find()
    .then(studios => res.render('studios/index', { studios }));
}

function showRoute(req, res, next) {
  studio.findById(req.params.id)
    .populate('comments.user')
    .then(studio => {
      console.log(studio);
      if(!studio) return res.render('pages/404');
      res.render('studios/show', { studio });
    })
    .catch(next);
}

function newRoute(req, res) {
  res.render('studios/new');
}

function createRoute(req, res, next) {
  studio.create(req.body)
    .then(() => res.redirect('/studios'))
    .catch(next);
}

function editRoute(req, res) {
  studio.findById(req.params.id)
    .then(studio => res.render('studios/edit', { studio }));
}

function updateRoute(req, res) {
  studio.findById(req.params.id)
    .then(studio => Object.assign(studio, req.body))
    .then(studio => studio.save())
    .then(() => res.redirect(`/studios/${req.params.id}`));
}

function deleteRoute(req, res) {
  studio.findById(req.params.id)
    .then(studio => studio.remove())
    .then(() => res.redirect('/studios'));
}

module.exports = {
  index: indexRoute,
  show: showRoute,
  new: newRoute,
  create: createRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute
};
