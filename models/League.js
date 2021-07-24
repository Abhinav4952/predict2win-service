const mongoose = require('mongoose');

const LeagueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please league name'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User Id is mandatory'],
  },
  description: {
    type: String,
  },
  leagueStatus: {
    type: String,
    enum: ['CREATED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'IN_PROGRESS', 'EXPIRED'],
    default: 'CREATED',
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  leagueCategory: {
    type: String,
    enum: ['CRICKET', 'FOOT_BALL', 'BASKET_BALL'],
    default: 'CREATED',
  },
  slots: {
    type: Number,
    default: 0,
  },
  created: { type: String },
  startDate: { type: String },
  expiryDate: { type: String },
  updated: { type: String, required: false, default: new Date().toISOString() },
});

const League = mongoose.model('League', LeagueSchema);

module.exports = League;
