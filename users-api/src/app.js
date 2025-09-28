const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const usersRouter = require('./routes/users');

function createApp(db) {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.set('db', db);

  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use('/api/users', usersRouter);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}

module.exports = createApp;
