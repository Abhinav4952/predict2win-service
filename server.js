require('dotenv').config({ path: './config.env' });
const path = require('path');
const express = require('express');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const errorHandler = require('./middleware/error');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc=require('./utils/swagger.json');

const fs = require('fs');

connectDB();

const app = express();

const dir = path.join(__dirname, '/uploads');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, {
    recursive: true,
  });
} else {
  try {
    fs.rmdirSync(dir, {
      recursive: true,
    });
    fs.mkdirSync(dir, {
      recursive: true,
    });
  } catch (err) {
    console.log('Error in delete uploads folder');
  }
  console.log('exists');
}

// app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true,
  }),
);
//https://git.heroku.com/enigmatic-temple-25922.git
//https://enigmatic-temple-25922.herokuapp.com/
app.use('/api/v1/posts', postRoutes);
app.use(
  '/api/v1/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc),
);

app.use('/api/v1/auth', require('./routes/authRoute'));
app.use('/api/v1/admin', require('./routes/adminRoute'));
app.use('/api/v1/leagueAdmin', require('./routes/leagueAdminRoute'));
app.use('/api/v1/user', require('./routes/userRoute'));
app.use('/api/v1/private', require('./routes/private'));

// Error Handler Middleware
app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Api running');
  });
}
const PORT = process.env.PORT;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
