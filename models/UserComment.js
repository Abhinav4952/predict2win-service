const mongoose = require('mongoose');

const UserCommentsSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'PostId is mandatory'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User Id is mandatory'],
  },
  comment: {
    type: String,
  },
  created: { type: String },
  updated: { type: String, required: false, default: new Date().toISOString() },
});

const UserComment = mongoose.model('UserComment', UserCommentsSchema);

module.exports = UserComment;
