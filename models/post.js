const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

commentSchema.methods.isOwnedBy = function(user) {
  return this.user && user._id.equals(this.user._id);
};

const schema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2 },
  content: { type: String, required: true, minlength: 30 },
  image: { type: String, pattern: /^https?\/\/.+/},
  comments: [ commentSchema ]
});


module.exports = mongoose.model('Post', schema);
