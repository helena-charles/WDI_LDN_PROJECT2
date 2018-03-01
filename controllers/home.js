const Studio = require('../models/studio');
const Dance = require('../models/dance');
const User = require('../models/user');
const Promise = require('bluebird');

function getReviewCount(Model) {
  return Model.find()
    .then(items => {
      const length = items.map(i => i.comments.length).reduce((sum, v) => sum + v, 0);
      return length;
    });
}

function getUserCount() {
  return User.find()
    .then(users => {
      return users.length;
    });
}

function indexRoute(req, res) {
  const studioCount = Studio.count();
  const danceCount = Dance.count();
  const studioReviewsCount = getReviewCount(Studio);
  const danceReviewsCount = getReviewCount(Dance);
  const userCount = User.count();

  Promise.props({
    studioCount,
    danceCount,
    studioReviewsCount,
    danceReviewsCount,
    userCount
  })
    .then(data => {
      res.render('pages/home', { count: data });
    });
}

module.exports = {
  index: indexRoute,
  userCount: getUserCount
};
