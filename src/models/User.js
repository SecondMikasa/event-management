const db = require('../config/db');

const User = {
  findByEmail: async (email) => {
    const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  },
  create: async (name, email) => {
    const res = await db.query(
      'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *',
      [name, email]
    );
    return res.rows[0];
  },
  findById: async (id) => {
    const res = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0];
  }
};

module.exports = User;