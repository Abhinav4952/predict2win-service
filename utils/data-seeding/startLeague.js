require('dotenv').config({ path: '../../config.env' });
const LeagueStatus = require('../../helpers/enums/LeagueStatus');
const League = require('../../models/League');

async function startLeague({ leagueId, slots }) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await League.findByIdAndUpdate(
          leagueId,
          {
            leagueStatus: LeagueStatus.RegistrationOpen,
            slots,
            updated: new Date().toISOString(),
          },
          { useFindAndModify: false },
        );
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

module.exports = startLeague;
