const router = require('express').Router();
const dances = require('../controllers/dances');
const studios = require('../controllers/studios');
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const secureRoute = require('../lib/secureRoute');

router.get('/', (req, res) => res.render('pages/home'));

router.route('/dances')
  .get(dances.index)
  .post(secureRoute, dances.create);

router.route('/dances/filter')
  .post(dances.filter);

router.route('/dances/new')
  .get(secureRoute, dances.new);

router.route('/dances/:id')
  .get(dances.show)
  .put(secureRoute, dances.update)
  .delete(secureRoute, dances.delete);

router.route('/dances/:id/edit')
  .get(secureRoute, dances.edit);

router.route('/dances/:id/comments')
  .post(secureRoute, dances.commentsCreate);

router.route('/dances/:id/comments/:commentId')
  .delete(secureRoute, dances.commentsDelete);

router.route('/studios')
  .get(studios.index)
  .post(secureRoute, studios.create);

router.route('/studios/new')
  .get(secureRoute, studios.new);

router.route('/studios/:id')
  .get(studios.show)
  .put(secureRoute, studios.update)
  .delete(secureRoute, studios.delete);

router.route('/studios/:id/edit')
  .get(secureRoute, studios.edit);

router.route('/studios/:id/comments')
  .post(secureRoute, dances.commentsCreate);

router.route('/studios/:id/comments/:commentId')
  .delete(secureRoute, dances.commentsDelete);

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
