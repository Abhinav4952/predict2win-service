require('dotenv').config({ path: '../../config.env' });
const League = require('../../models/League');
const LeagueQuestion = require('../../models/LeagueQuestion');
const LoremIpsum = require('lorem-ipsum').LoremIpsum;
const LeagueCategory = require('../../helpers/enums/LeagueCategory');
const LeagueStatus = require('../../helpers/enums/LeagueStatus');
const LeagueQuestionType = require('../../helpers/enums/LeagueQuestionType');
const startLeague = require('./startLeague');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function createQuestionsForLeague(leagueId, questionsLength) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const leagueQuestionsLength = [...Array(questionsLength).keys()];
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

        const options = [
          { optionValue: lorem.generateWords(1) },
          { optionValue: lorem.generateWords(1) },
          { optionValue: lorem.generateWords(1) },
          { optionValue: lorem.generateWords(1) },
        ];

        await asyncForEach(leagueQuestionsLength, async element => {
          await LeagueQuestion.create({
            name: lorem.generateSentences(3),
            leagueId,
            questionType: LeagueQuestionType.RadioButton,
            options,
            correctAnswerValue: 2,
            wrongAnswerValue: 0,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
          });
        });

        console.log('League  Questions Created for leagueId', leagueId);

        await startLeague({
          leagueId,
          slots: 15,
        });

        console.log(leagueId, 'Started with 15 slots');

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

module.exports = createQuestionsForLeague;
