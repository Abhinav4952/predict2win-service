require('dotenv').config({ path: '../../config.env' });
const connectDB = require('../../config/db');
const createAdminUser = require('./createAdminUser');

connectDB();

(async () => {
  console.log('Seeding Data');
  try {
    const adminUserToken = await createAdminUser();
    console.log(adminUserToken);
  } catch (err) {
    console.log(err);
  }
})();
