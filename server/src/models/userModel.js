const pool = require('../config/db');

const UserModel = {
  async findByGoogleId(googleId) {
    const result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query('SELECT id, email, name, avatar_url, refresh_token, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async createUser({ googleId, email, name, avatarUrl, refreshToken }) {
    const query = `
      INSERT INTO users (google_id, email, name, avatar_url, refresh_token)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [googleId, email, name, avatarUrl, refreshToken];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};

module.exports = UserModel;