require('dotenv').config();
const path = require('path');
const { initDB } = require('./src/db');
const createApp = require('./src/app');

const PORT = process.env.PORT || 8080;
const DB_FILE = process.env.DATABASE_FILE || path.join(__dirname, 'data', 'database.sqlite');

(async () => {
  try {
    const db = await initDB(DB_FILE);
    const app = createApp(db);
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
