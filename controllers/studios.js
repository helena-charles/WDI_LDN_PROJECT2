const studio = require('../models/studio');
const Dance = require('../models/dance');

function indexRoute(req, res) {
  studio.find()
    .then(studios => res.render('studios/index', { studios }));
}

function showRoute(req, res, next) {
  studio.findById(req.params.id)
    .populate('comments.user')
    .then(studio => {
      if(!studio) {
        return res.render('pages/404');
      }
      return studio;
    })
    .then(studio => {
      Dance.find({'studio': studio.name}).then(dances => {
        res.render('studios/show', { studio: {
          ...studio.toObject(),
          dances: dances
        }});
      });
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

function commentsCreateRoute(req, res, next) {
  req.body.user = req.currentUser;
  studio.findById(req.params.id)
    .then(studio => {
      studio.comments.push(req.body);
      return studio.save();
    })
    .then(studio => res.redirect(`/studios/${studio._id}`))
    .catch(next);
}

function commentsDeleteRoute(req, res, next) {
  studio.findById(req.params.id)
    .then(studio => {
      const comment = studio.comments.id(req.params.commentId);
      comment.remove();
      return studio.save();
    })
    .then(studio => res.redirect(`/studios/${studio._id}`))
    .catch(next);
}

module.exports = {
  index: indexRoute,
  show: showRoute,
  new: newRoute,
  create: createRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  commentsCreate: commentsCreateRoute,
  commentsDelete: commentsDeleteRoute
};
