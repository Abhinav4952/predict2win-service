require('dotenv').config({ path: '../../config.env' });
const User = require('../../models/User');

async function createUser({username, email, password, userType }) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const user = await User.create({
          username,
          email,
          password,
          userType,
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

module.exports = createUser;
