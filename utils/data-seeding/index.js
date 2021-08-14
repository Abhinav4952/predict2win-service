require('dotenv').config({ path: '../../config.env' });
const connectDB = require('../../config/db');
const UserRole = require('../../helpers/enums/UserRole');
const createUsers = require('./createUsers');
const createQuestionsForLeague = require('./createQuestionsForLeague');
const User = require('../../models/User');
const League = require('../../models/League');
const createLeague = require('./createLeague');
const registerUsersforLeague = require('./registerUsersforLeague');

connectDB();

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

(async () => {
  console.log('Seeding Data');
  try {
    console.log('Creating users');
    await createUsers();
    console.log('Users Created');
    const leagueAdminsList = await User.find({ userType: UserRole.LeagueAdmin }, { _id: 1 });
    await asyncForEach(leagueAdminsList, async element => {
      await createLeague(element._id);
    });
    const leaguesList = await League.find({}, { _id: 1, slots: 1 });
    console.log('leagues created', leaguesList);
    await asyncForEach(leaguesList, async element => {
      await createQuestionsForLeague(element._id, 5);
    });
    console.log('Questions created for all leagues');
    const normalUsersList = await User.find({ userType: UserRole.User }, { _id: 1 });
    await registerUsersforLeague({
      usersList: normalUsersList,
      leaguesList,
    });
  } catch (err) {
    console.log(err);
  }
})();
