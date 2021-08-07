const express = require('express');
const router = express.Router();

const {
  getLeaguesforUser,
  getLeagueById,
  registerForLeague,
  getQuestionByLeague,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.route('/leagues').get(protect, getLeaguesforUser);
router.route('/getLeagueById/:leagueId').get(protect, getLeagueById);
router.route('/register/:leagueId').post(protect, registerForLeague);
router.route('/getQuestionsByLeagueId/:leagueId').get(protect, getQuestionByLeague);
//Add more validation to above  API
//API to answer user selected quetions
// API to fetch questions with selected answer after user selects answers
// API to fecth correct answers with selected answer

module.exports = router;
