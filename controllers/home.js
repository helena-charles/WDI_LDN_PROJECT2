const Studio = require('../models/studio');
const Dance = require('../models/dance');
const Promise = require('bluebird');

function getReviewCount(Model) {
    return Model.find().then(items => {
        const length = items.map(i => i.comments.length).reduce((sum, v) => sum + v);
        return length;
    })
}

function indexRoute(req, res) {
    const studioCount = Studio.count();
    const danceCount = Dance.count();
    const studioReviewsCount = getReviewCount(Studio);
    const danceReviewsCount = getReviewCount(Dance);

    Promise.props({
        studioCount,
        danceCount,
        studioReviewsCount,
        danceReviewsCount
    })
    .then(data => {
        res.render('pages/home', { count: data });
    })
}

module.exports = {
    index: indexRoute
}