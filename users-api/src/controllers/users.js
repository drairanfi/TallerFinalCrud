const bcrypt = require('bcryptjs');

exports.list = async (req, res, next) => {
  try {
    const db = req.app.get('db');
    const rows = await db.all('SELECT id, name, email, created_at, updated_at FROM users');
    res.json(rows);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const db = req.app.get('db');
    const user = await db.get('SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?', req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const db = req.app.get('db');
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.run('INSERT INTO users (name, email, password) VALUES (?,?,?)', [name, email, hashed]);
    const user = await db.get('SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?', result.lastID);
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') return res.status(400).json({ error: 'Email already exists' });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const db = req.app.get('db');
    const id = req.params.id;
    const existing = await db.get('SELECT id FROM users WHERE id = ?', id);
    if (!existing) return res.status(404).json({ error: 'User not found' });

    const { name, email, password } = req.body;
    const parts = [];
    const params = [];

    if (name) { parts.push('name = ?'); params.push(name); }
    if (email) { parts.push('email = ?'); params.push(email); }
    if (password) { parts.push('password = ?'); params.push(await bcrypt.hash(password, 10)); }

    if (parts.length === 0) return res.status(400).json({ error: 'No fields to update' });

    params.push(id);
    const sql = `UPDATE users SET ${parts.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await db.run(sql, params);
    const user = await db.get('SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?', id);
    res.json(user);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') return res.status(400).json({ error: 'Email already exists' });
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const db = req.app.get('db');
    const result = await db.run('DELETE FROM users WHERE id = ?', req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (err) { next(err); }
};
