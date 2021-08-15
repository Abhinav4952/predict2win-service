const mongoose = require('mongoose');

const UserPostSchema = new mongoose.Schema({
  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'LeagueId is mandatory'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User Id is mandatory'],
  },
  post: {
    type: String,
  },
  created: { type: String },
  updated: { type: String, required: false, default: new Date().toISOString() },
});

const UserPost = mongoose.model('UserPost', UserPostSchema);

module.exports = UserPost;
