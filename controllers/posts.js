const Post = require('../models/post');

function indexRoute(req, res) {
  Post.find()
    .then(posts => res.render('posts/index', { posts }));
}

function showRoute(req, res, next) {
  Post.findById(req.params.id)
    .then(post => res.render('posts/show', { post }))
    .catch(next);
}

function newRoute(req, res) {
  res.render('posts/new');
}

function createRoute(req, res, next) {
  Post.create(req.body)
    .then(() => res.redirect('/posts'))
    .catch(next);
}

function editRoute(req, res) {
  Post.findById(req.params.id)
    .then(post => res.render('posts/edit', { post }));
}

function updateRoute(req, res) {
  Post.findById(req.params.id)
    .then(post => Object.assign(post, req.body))
    .then(post => post.save())
    .then(() => res.redirect(`/posts/${req.params.id}`));
}

function deleteRoute(req, res) {
  Post.findById(req.params.id)
    .then(post => post.remove())
    .then(() => res.redirect('/posts'));
}

function commentsCreateRoute(req, res, next) {
  req.body.user = req.currentUser;
  Post.findById(req.params.id)
    .then(post => {
      post.comments.push(req.body);
      return post.save();
    })
    .then(post => res.redirect(`/posts/${post._id}`))
    .catch(next);
}

function commentsDeleteRoute(req, res, next) {
  Post.findById(req.params.id)
    .then(post => {
      const comment = post.comments.id(req.params.commentId);
      comment.remove();
      return post.save();
    })
    .then(post => res.redirect(`/posts/${post._id}`))
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
