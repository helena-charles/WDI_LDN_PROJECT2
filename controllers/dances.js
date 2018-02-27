const Dance = require('../models/dance');
// const Category = require('../models/category');
// const mongoose = require('mongoose');
// mongoose.Promise = require('bluebird');
// mongoose.Types.ObjectId.isValid(Dance.category);


function indexRoute(req, res) {
  const selection = false;
  Dance.find()
    .then(dances => res.render('dances/index', { dances, selection }));
}

function filter(req, res) {
  const selection = req.body.category;
  Dance.find()
    .then(dances => res.render('dances/index', { dances, selection }));
}

function showRoute(req, res, next) {
  Dance.findById(req.params.id)
    .populate('comments.user')
    .then(dance => {
      console.log(dance);
      if(!dance) return res.render('pages/404');
      res.render('dances/show', { dance });
    })
    .catch(next);
}


function newRoute(req, res) {
  Category.find()
    .then(categories => res.render('dances/new', { categories }));
}

function createRoute(req, res, next) {
  Dance.create(req.body)
    .then(() => res.redirect('/dances'))
    .catch(next);
}

function editRoute(req, res) {
  Dance.findById(req.params.id)
    .then(dance => res.render('dances/edit', { dance })); // inject the data into the view
}

function updateRoute(req, res) {
  Dance.findById(req.params.id)
    .then(dance => Object.assign(dance, req.body))
    .then(dance => dance.save())
    .then(() => res.redirect(`/dances/${req.params.id}`));
}

function deleteRoute(req, res) {
  Dance.findById(req.params.id)
    .then(dance => dance.remove())
    .then(() => res.redirect('/dances'));
}

function commentsCreateRoute(req, res, next) {
  req.body.user = req.currentUser;
  Dance.findById(req.params.id)
    .then(dance => {
      dance.comments.push(req.body);
      return dance.save();
    })
    .then(dance => res.redirect(`/dances/${dance._id}`))
    .catch(next);
}

function commentsDeleteRoute(req, res, next) {
  Dance.findById(req.params.id)
    .then(dance => {
      const comment = dance.comments.id(req.params.commentId);
      comment.remove();
      return dance.save();
    })
    .then(dance => res.redirect(`/dances/${dance._id}`))
    .catch(next);
}

module.exports = {
  index: indexRoute,
  filter: filter,
  show: showRoute,
  new: newRoute,
  create: createRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  commentsCreate: commentsCreateRoute,
  commentsDelete: commentsDeleteRoute
};
