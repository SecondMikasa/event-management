const db = require('../config/db');

const Event = {
  create: async (title, datetime, location, capacity) => {
    const res = await db.query(
      `INSERT INTO events(title, datetime, location, capacity)
       VALUES($1, $2, $3, $4) RETURNING *`,
      [title, datetime, location, capacity]
    );
    return res.rows[0];
  },

  findById: async (id) => {
    const res = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    return res.rows[0];
  },

  findUpcoming: async () => {
    const now = new Date().toISOString();
    const res = await db.query(
      `SELECT * FROM events WHERE datetime > $1 ORDER BY datetime ASC, location ASC`,
      [now]
    );
    return res.rows;
  },

  getRegistrationCount: async (eventId) => {
    const res = await db.query(
      'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
      [eventId]
    );
    return parseInt(res.rows[0].count, 10);
  },

  isUserRegistered: async (userId, eventId) => {
    const res = await db.query(
      'SELECT 1 FROM registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    return res.rows.length > 0;
  },

  registerUser: async (userId, eventId) => {
    // Use serializable transaction to prevent race conditions
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const countRes = await client.query(
        'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
        [eventId]
      );
      const current = parseInt(countRes.rows[0].count, 10);
      const eventRes = await client.query('SELECT capacity FROM events WHERE id = $1', [eventId]);
      if (!eventRes.rows.length) throw new Error('Event not found');
      const capacity = eventRes.rows[0].capacity;

      if (current >= capacity) {
        throw new Error('Event is full');
      }

      await client.query(
        'INSERT INTO registrations(user_id, event_id) VALUES($1, $2)',
        [userId, eventId]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  unregisterUser: async (userId, eventId) => {
    const res = await db.query(
      'DELETE FROM registrations WHERE user_id = $1 AND event_id = $2',
      [userId, eventId]
    );
    return res.rowCount > 0;
  }
};

module.exports = Event;