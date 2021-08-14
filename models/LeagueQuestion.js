const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
    {
      optionValue: {type: String, required: false, unique: false},
    },
  );

const LeagueQuestionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please league name'],
    unique: false
  },
  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "League Id is mandatory"],
  },
  questionType: { 
    type: String, 
  },
  options: [optionSchema],
  correctAnswerValue: {type: Number, required: true},
  wrongAnswerValue: {type: Number, default: 0}, 
  correctAnswer: {type: String, unique:false},
  isAnswerUpdated: {type: Boolean, default: false},
  isDeleted: {type: Boolean, default: false},
  created: { type: String },
  updated: { type: String, required: false, default: new Date().toISOString() },
});

const LeagueQuestion = mongoose.model('LeagueQuestion', LeagueQuestionSchema);

module.exports = LeagueQuestion;
