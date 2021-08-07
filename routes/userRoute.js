const express = require('express');
const router = express.Router();

const {
  getLeaguesforUser,
  getLeagueById,
  registerForLeague,
  getQuestionByLeague,
  updateAnswersForLeague,
  getQuestionDetailsByParticipationId,
  getAnswersByParticipation
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.route('/leagues').get(protect, getLeaguesforUser);
router.route('/getLeagueById/:leagueId').get(protect, getLeagueById);
router.route('/register/:leagueId').post(protect, registerForLeague);
router.route('/getQuestionsByLeagueId/:leagueId').get(protect, getQuestionByLeague);
router.route('/updateAnswers/:participationId').post(protect, updateAnswersForLeague);
router.route('/getQuestionDetails/:participationId').get(protect, getQuestionDetailsByParticipationId);
router.route('/getAnswersByParticipation/:participationId').get(protect, getAnswersByParticipation);
//Add more validation to above  API

module.exports = router;
