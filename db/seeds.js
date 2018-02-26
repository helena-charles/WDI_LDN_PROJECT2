const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Dance = require('../models/dance');
const danceData = require('./data/dances');
const Studio = require('../models/studio');
const studioData = require('./data/studios');

mongoose.connect('mongodb://localhost/dances-database', (err, db) => {
  db.dropDatabase();

  Dance.create(danceData)
    .then(dances => console.log(`${dances.length} dances created`))
    .then(() => Studio.create(studioData))
    .then(studios => console.log(`${studios.length} studios created`))
    .catch(err => console.log(err))
    .finally(() => mongoose.connection.close());
});
