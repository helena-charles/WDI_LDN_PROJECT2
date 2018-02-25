const router = require('express').Router();
const posts = require('../controllers/posts');
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const secureRoute = require('../lib/secureRoute');

router.get('/', (req, res) => res.render('pages/home'));

router.route('/posts')
  .get(posts.index)
  .post(secureRoute, posts.create);

router.route('/posts/new')
  .get(secureRoute, posts.new);

router.route('/posts/:id')
  .get(posts.show)
  .put(secureRoute, posts.update)
  .delete(secureRoute, posts.delete);

router.route('/posts/:id/edit')
  .get(secureRoute, posts.edit);

router.route('/posts/:id/comments')
  .post(secureRoute, posts.commentsCreate);

router.route('.posts/:id/comments/:commentId')
  .delete(secureRoute, posts.commentsDelete);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

router.all('/*', (req, res) => res.render('pages/404'));

module.exports = router;
