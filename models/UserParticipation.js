const mongoose = require('mongoose');

const selectedAnswers = new mongoose.Schema(
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "question Id is mandatory"],
        unique: false,
      },
      option: {
        type: String,
        required: [true, "Option is mandatory"],
        unique: false,
      }
    },
  );

const UserParticipationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User Id is mandatory'],
  },
  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'League Id is mandatory'],
  },
  userParticipationStatus: {
    type: String,
    enum: ['REGISTERED','QUESTIONS_ANSWERED','CLOSED'],
    default: 'REGISTERED',
  },
  questionsAnswered: [selectedAnswers],
  created: {type: Date},
  updated: {type: Date, required: false, default: Date.now},
});

const UserParticipation = mongoose.model('UserParticipation', UserParticipationSchema);

module.exports = UserParticipation;
