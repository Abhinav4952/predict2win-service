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

module.exports = router;
