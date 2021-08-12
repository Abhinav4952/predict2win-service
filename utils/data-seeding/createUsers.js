require('dotenv').config({ path: '../../config.env' });
const UserRole = require('../../helpers/enums/UserRole');
const createUser = require('./createUser');

async function createUsers() {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await createUser({
            username: 'seed data admin',
            email: 'testadmin@gmail.com',
            password: 'admin1234',
            userType: UserRole.Admin,
          });
          console.log('Creating a leagueAdmin 1');
          await createUser({
            username: 'seed league admin2',
            email: 'test_league_admin_1@gmail.com',
            password: '12345678',
            userType: UserRole.LeagueAdmin,
          });
      
          console.log('Creating a leagueAdmin 2');
          await createUser({
            username: 'seed league admin1',
            email: 'test_league_admin_2@gmail.com',
            password: '12345678',
            userType: UserRole.LeagueAdmin,
          });
          console.log('Creating a normalUser 1');
          await createUser({
            username: 'seed user test1',
            email: 'test_user_1@gmail.com',
            password: '12345678',
            userType: UserRole.User,
          });
          console.log('Creating a normalUser 2');
          await createUser({
            username: 'seed user test2',
            email: 'test_user_2@gmail.com',
            password: '12345678',
            userType: UserRole.User,
          });
        resolve();
      } catch {
        err => {
          console.log(err);
          reject(err);
        };
      }
    })();
  });
};

module.exports = createUsers;
