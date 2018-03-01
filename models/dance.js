const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  maintitle: { type: String, minlength: 2 },
  content: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
},{
  timestamps: true
});

commentSchema
  .virtual('formattedDate')
  .get(function getFormattedDate() {
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthName[this.createdAt.getMonth()] + '-' + this.createdAt.getFullYear();
  });

commentSchema.methods.isOwnedBy = function(user) {
  return this.user._id && user._id.equals(this.user._id);
};

const schema = new mongoose.Schema({
  danceClass: { type: String, required: true, minlength: 2 },
  studio: { type: String, required: true, minlength: 2 },
  content: { type: String, required: true, minlength: 30 },
  image: { type: String, pattern: /^https?\/\/.+/},
  comments: [ commentSchema ],
  category: { type: String, minlength: 2 }
});

schema
  .virtual('avgRating')
  .get(function getAvgRating() {
    if(this.comments.length === 0) return 'No Ratings';
    const ratings = this.comments.map(comment => comment.rating);
    return Math.round(((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 2) / 2);
  });

schema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model('Dance', schema);
