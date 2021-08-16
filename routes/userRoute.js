const express = require('express');
const router = express.Router();

const {
  getLeaguesforUser,
  getLeagueById,
  registerForLeague,
  getQuestionByLeague,
  updateAnswersForLeague,
  getQuestionDetailsByParticipationId,
  getAnswersByParticipation,
  getLeaderBoardByLeagueId,
  createPost,
  getPosts
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.route('/leagues').get(protect, getLeaguesforUser);
router.route('/getLeagueById/:leagueId').get(protect, getLeagueById);
router.route('/register/:leagueId').post(protect, registerForLeague);
router.route('/getQuestionsByLeagueId/:leagueId').get(protect, getQuestionByLeague);
router.route('/updateAnswers/:participationId').post(protect, updateAnswersForLeague);
router.route('/getQuestionDetails/:participationId').get(protect, getQuestionDetailsByParticipationId);
router.route('/getAnswersByParticipation/:participationId').get(protect, getAnswersByParticipation);
router.route('/getLeaderBoard/:leagueId').get(protect, getLeaderBoardByLeagueId);
router.route('/createPost/:leagueId').post(protect, createPost);
router.route('/getPostsByLeagueId/:leagueId').get(protect, getPosts);
//Add more validation to above  API

module.exports = router;
