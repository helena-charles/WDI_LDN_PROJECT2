const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Post = require('../models/post');
const postData = require('./data/posts');

mongoose.connect('mongodb://localhost/blogposts-database', (err, db) => {
  db.dropDatabase();

  Post.create(postData)
    .then(posts => console.log(`${posts.length} posts created`))
    .catch(err => console.log(err))
    .finally(() => mongoose.connection.close());
});
