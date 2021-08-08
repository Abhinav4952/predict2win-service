const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  addLeague,
  getCurretUserLeague,
  getLeagueById,
  addQuestion,
  updateAnswers,
  startLeague,
  stopLeague,
  getQuestionByLeague,
  getParticipationsByLeagueId,
  getLeaderBoardByLeagueId,
  getLeagueStats,
} = require('../controllers/leagueAdminController');
const { leagueAdminProtect } = require('../middleware/auth');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

var upload = multer({ storage: storage });

router.route('/addLeague').post(leagueAdminProtect, upload.single('image'), addLeague);
router.route('/getLeagues').get(leagueAdminProtect, getCurretUserLeague);
router.route('/getLeagueById/:leagueId').get(leagueAdminProtect, getLeagueById);
router.route('/addQuestion').post(leagueAdminProtect, addQuestion);
router.route('/getQuestionsByLeague/:leagueId').get(leagueAdminProtect, getQuestionByLeague);
router.route('/updateAnswer').post(leagueAdminProtect, updateAnswers);
router.route('/startLeague').post(leagueAdminProtect, startLeague);
router.route('/stopLeague').post(leagueAdminProtect, stopLeague);
router.route('/getParticipationsByLeagueId/:leagueId').get(leagueAdminProtect, getParticipationsByLeagueId);
router.route('/getLeaderBoardByLeagueId/:leagueId').get(leagueAdminProtect, getLeaderBoardByLeagueId);
router.route('/getLeagueStats/:leagueId').get(leagueAdminProtect, getLeagueStats);
//API to calculate user specific selceted answers


module.exports = router;
