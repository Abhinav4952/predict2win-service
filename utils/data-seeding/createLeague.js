require('dotenv').config({ path: '../../config.env' });
const League = require('../../models/League');
const LoremIpsum = require('lorem-ipsum').LoremIpsum;
const path = require('path');
const fs = require('fs');
const LeagueCategory = require('../../helpers/enums/LeagueCategory');
const LeagueStatus = require('../../helpers/enums/LeagueStatus');
var moment = require('moment');

const getRandomLimit = (upperLimit, lowerLimit) => Math.floor(Math.random() * upperLimit) + lowerLimit;

const imagesList = ['Screenshot_1.png', 'Screenshot_2.png'];

async function createLeague(leagueAdminId) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const lorem = new LoremIpsum({
          sentencesPerParagraph: {
            max: 8,
            min: 4,
          },
          wordsPerSentence: {
            max: 16,
            min: 4,
          },
        });

        const leagueDetails = await League.create({
          name: lorem.generateWords(1),
          userId: leagueAdminId,
          description: lorem.generateSentences(2),
          leagueCategory: LeagueCategory.Cricket,
          leagueStatus: LeagueStatus.Created,
          image: {
            data: fs.readFileSync(
              path.join(__dirname, '.', 'images', imagesList[getRandomLimit(imagesList.length, 0)]),
            ),
            contentType: 'image/png',
          },
          created: new Date().toISOString(),
          expiryDate: moment().add(5, 'months').toISOString(),
        });

        console.log('League Created');
        resolve(leagueDetails);
      } catch {
        err => {
          console.log(err);
          reject(err);
        };
      }
    })();
  });
}

module.exports = createLeague;
