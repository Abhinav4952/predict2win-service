require('dotenv').config({ path: '../../config.env' });
const connectDB = require('../../config/db');
const UserRole = require('../../helpers/enums/UserRole');
const createUsers = require('./createUsers');
const User = require('../../models/User');
const League = require('../../models/League');
const LoremIpsum = require('lorem-ipsum').LoremIpsum;
const path = require('path');
const fs = require('fs');
const LeagueCategory = require('../../helpers/enums/LeagueCategory');
const LeagueStatus = require('../../helpers/enums/LeagueStatus');
const createLeague = require('./createLeague');

connectDB();

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

(async () => {
  console.log('Seeding Data');
  try {
    console.log('Creating users');
    const usersList = await createUsers();
    console.log('Users Created');
    const leagueAdminsList = await User.find({ userType: UserRole.LeagueAdmin }, { _id: 1 });
    console.log(leagueAdminsList);
    await asyncForEach(leagueAdminsList, async element => {
      await createLeague(element._id);
    });
    console.log('leagues created');
    // console.log(lorem.generateSentences(5));
  } catch (err) {
    console.log(err);
  }
})();
