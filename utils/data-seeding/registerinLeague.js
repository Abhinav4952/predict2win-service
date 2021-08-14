require('dotenv').config({ path: '../../config.env' });
const League = require('../../models/League');
const UserParticipation = require('../../models/UserParticipation');
const UserParticipationStatus = require('../../helpers/enums/UserParticipationStatus');

async function registerinLeague({ leagueId, leagueSlots, userId }) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await UserParticipation.create({
          leagueId,
          userId,
          userParticipationStatus: UserParticipationStatus.Registered,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        });
        console.log(userId, 'Registered for league', leagueId);
        await League.findByIdAndUpdate(
          leagueId,
          {
            slots: Number(leagueSlots - 1),
            updated: new Date().toISOString(),
          },
          { useFindAndModify: false },
        );
        console.log("Slots updated for league:- ", leagueId);

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

module.exports = registerinLeague;
