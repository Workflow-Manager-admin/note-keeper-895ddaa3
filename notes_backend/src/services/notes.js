const { Pool } = require('pg');

/**
 * NotesService handles all business logic and DB queries for notes.
 * Uses Postgres via environment configuration from .env/database.
 */
class NotesService {
  constructor() {
    // PUBLIC_INTERFACE
    /**
     * Initialize PostgreSQL connection pool using environment variables.
     */
    this.pool = new Pool({
      host: process.env.NOTES_DATABASE_HOST,
      port: process.env.NOTES_DATABASE_PORT,
      database: process.env.NOTES_DATABASE_NAME,
      user: process.env.NOTES_DATABASE_USER,
      password: process.env.NOTES_DATABASE_PASSWORD,
      max: 10,
      idleTimeoutMillis: 30000,
    });
    // Create notes table on startup if not present.
    this._ensureTable();
  }

  // PUBLIC_INTERFACE
  /**
   * Ensures notes table exists in the database.
   */
  async _ensureTable() {
    const createSql = `
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    try {
      await this.pool.query(createSql);
    } catch (err) {
      console.error('Could not create notes table:', err.message);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new note.
   * @param {string} title
   * @param {string} content
   * @returns {Promise<Object>}
   */
  async createNote(title, content) {
    const insertSql = `
      INSERT INTO notes (title, content)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await this.pool.query(insertSql, [title, content]);
    return rows[0];
  }

  // PUBLIC_INTERFACE
  /**
   * Get a note by ID.
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async getNote(id) {
    const { rows } = await this.pool.query('SELECT * FROM notes WHERE id = $1', [id]);
    return rows[0] || null;
  }

  // PUBLIC_INTERFACE
  /**
   * Get all notes, with optional search by a term (matches title or content, case-insensitive).
   * @param {string} [searchTerm]
   * @returns {Promise<Array>}
   */
  async listNotes(searchTerm) {
    if (searchTerm) {
      const { rows } = await this.pool.query(
        'SELECT * FROM notes WHERE title ILIKE $1 OR content ILIKE $1 ORDER BY updated_at DESC',
        [`%${searchTerm}%`]
      );
      return rows;
    } else {
      const { rows } = await this.pool.query(
        'SELECT * FROM notes ORDER BY updated_at DESC'
      );
      return rows;
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Update a note.
   * @param {number} id
   * @param {string} title
   * @param {string} content
   * @returns {Promise<Object|null>}
   */
  async updateNote(id, title, content) {
    const updateSql = `
      UPDATE notes
      SET title = $2, content = $3, updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await this.pool.query(updateSql, [id, title, content]);
    return rows[0] || null;
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a note.
   * @param {number} id
   * @returns {Promise<boolean>} True if deleted
   */
  async deleteNote(id) {
    const { rowCount } = await this.pool.query('DELETE FROM notes WHERE id = $1', [id]);
    return rowCount > 0;
  }
}

module.exports = new NotesService();
