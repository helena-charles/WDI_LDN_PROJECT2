const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2 },
  content: { type: String, required: true, minlength: 30 },
  image: { type: String, pattern: /^https?\/\/.+/}
});

module.exports = mongoose.model('Post', schema);
