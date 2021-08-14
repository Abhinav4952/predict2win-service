require('dotenv').config({ path: '../../config.env' });
const League = require('../../models/League');
const registerinLeague = require('./registerinLeague');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const getRandomLimit = (upperLimit, lowerLimit) => Math.floor(Math.random() * upperLimit) + lowerLimit;

async function registerUsersforLeague({ usersList, leaguesList }) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await asyncForEach(usersList, async element => {
          const selectedLeague = leaguesList[getRandomLimit(leaguesList.length, 0)];
          const selectedLeaugeDetails = await League.findById(selectedLeague._id, { _id: 1, slots: 1 });
          console.log(element._id, 'user registering for league', selectedLeaugeDetails._id);
          await registerinLeague({
            leagueId: selectedLeague._id,
            leagueSlots: selectedLeaugeDetails.slots,
            userId: element._id,
          });
        });
        console.log('All Users are registered for leagues');
        resolve();
      } catch {
        err => {
          console.log(err);
          reject(err);
        };
      }
    })();
  });
}

module.exports = registerUsersforLeague;
