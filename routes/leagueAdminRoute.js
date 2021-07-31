const express = require('express');
const multer = require('multer');
const router = express.Router();
const { addLeague, getCurretUserLeague, getLeagueById, addQuestion, updateAnswers } = require('../controllers/leagueAdminController');
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
router.route('/updateAnswer').post(leagueAdminProtect, updateAnswers);

module.exports = router;
