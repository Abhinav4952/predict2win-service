require('dotenv').config({ path: '../../config.env' });
const UserRole = require('../../helpers/enums/UserRole');
const User = require('../../models/User');

async function createAdminUser() {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const user = await User.create({
          username: 'seed data admin',
          email: 'testadmin@gmail.com',
          password: 'admin1234',
          userType: UserRole.Admin,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        });
        const tokenValue = sendToken(user);
        resolve(tokenValue);
      } catch {
        err => {
          console.log(err);
          reject(err);
        };
      }
    })();
  });
}

const sendToken = user => {
  const token = user.getSignedJwtToken();
  return token;
};

module.exports = createAdminUser;
