const Dance = require('../models/dance');
const studio = require('../models/studio');

// const Category = require('../models/category');
// const mongoose = require('mongoose');
const Promise = require('bluebird');
// mongoose.Types.ObjectId.isValid(Dance.category);


function indexRoute(req, res) {
  if(req.query.category === 'All') req.query = {};

  Promise.props({
    allDances: Dance.find().exec(),
    dances: Dance.find(req.query).exec()
  })
    .then(data => {
      const allCategories = data.allDances.map(dance => dance.category);
      const uniqueCategories = Array.from(new Set(allCategories)).sort();

      res.render('dances/index', {
        dances: data.dances,
        categories: uniqueCategories,
        selectedCategory: req.query.category
      });
    });
}

function showRoute(req, res, next) {
  Dance.findById(req.params.id)
    .populate('comments.user')
    .then(dance => {
      if(!dance) return res.render('pages/404');
      res.render('dances/show', { dance });
    })
    .catch(next);
}

function newRoute(req, res) {
  res.render('dances/new');
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

function danceFavouriteRoute(req, res, next) {
  req.currentUser.favouriteList.push(req.params.id);

  req.currentUser.save()
    .then(() => res.redirect(`/dances/${req.params.id}`))
    .catch(next);
}

function deleteFavouriteRoute(req, res, next) {
  req.currentUser.favouriteList = req.currentUser.favouriteList.filter(dance => {
    return !dance._id.equals(req.params.id);
  });

  req.currentUser.save()
    .then(() => res.redirect(`/dances/${req.params.id}`))
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
  commentsDelete: commentsDeleteRoute,
  danceFavourite: danceFavouriteRoute,
  deleteFavourite: deleteFavouriteRoute
};
