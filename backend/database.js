const { Pool } = require('pg');
const path = require('path');

// Use PostgreSQL on Vercel, SQLite locally
const isSQLite = !process.env.POSTGRES_URL;

let db;

if (isSQLite) {
  // Dynamic import: only loaded locally — not on Vercel production builds
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.join(__dirname, 'database.sqlite');
  db = new sqlite3.Database(dbPath);

  /**
   * Promisified query compatible with pg's interface.
   * Correctly handles out-of-order $N params by tracking
   * the order of placeholder appearances.
   */
  db.query = (text, params = []) => {
    // Collect the 1-based param indices IN ORDER OF APPEARANCE in the query.
    const paramOrder = [];
    const sqliteText = text.replace(/\$(\d+)/g, (_, numStr) => {
      paramOrder.push(parseInt(numStr, 10) - 1); // convert to 0-based index
      return '?';
    });

    // Re-order params to match appearance order (fixes out-of-order $N bugs)
    const orderedParams = paramOrder.map(i => (params[i] !== undefined ? params[i] : null));

    return new Promise((resolve, reject) => {
      const isSelect = sqliteText.trim().toUpperCase().startsWith('SELECT');
      if (isSelect) {
        db.all(sqliteText, orderedParams, (err, rows) => {
          if (err) return reject(err);
          resolve({ rows });
        });
      } else {
        db.run(sqliteText, orderedParams, function (err) {
          if (err) return reject(err);
          resolve({ rows: [{ id: this.lastID }], lastID: this.lastID, changes: this.changes });
        });
      }
    });
  };

  // Thin client wrapper for transaction compatibility
  db.connect = async () => ({ query: db.query, release: () => {} });
} else {
  const connectionString = process.env.POSTGRES_URL.includes('?')
    ? `${process.env.POSTGRES_URL}&sslmode=require`
    : `${process.env.POSTGRES_URL}?sslmode=require`;

  db = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
}

const init = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id ${isSQLite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'SERIAL PRIMARY KEY'},
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        google_id VARCHAR(255),
        avatar TEXT,
        bio TEXT,
        theme_color VARCHAR(20) DEFAULT '#121212',
        wallpaper_url TEXT,
        profile_opacity REAL DEFAULT 0.6,
        profile_blur INTEGER DEFAULT 20,
        location TEXT,
        icon_color VARCHAR(20) DEFAULT '#ffffff',
        accent_color VARCHAR(20) DEFAULT '#ffffff',
        text_color VARCHAR(20) DEFAULT '#ffffff',
        bg_color VARCHAR(20) DEFAULT '#121212',
        font_family VARCHAR(100) DEFAULT 'Inter',
        cursor_type VARCHAR(50) DEFAULT 'default',
        music_url TEXT,
        show_verified_badge BOOLEAN DEFAULT false,
        card_animation VARCHAR(50) DEFAULT 'none',
        wallpaper_blur INTEGER DEFAULT 0,
        wallpaper_brightness INTEGER DEFAULT 100,
        wallpaper_overlay_color TEXT,
        reveal_animation VARCHAR(50) DEFAULT 'reveal-up',
        reveal_duration REAL DEFAULT 1,
        display_name TEXT,
        show_username BOOLEAN DEFAULT true,
        glow_intensity REAL DEFAULT 0.0,
        views INTEGER DEFAULT 0
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS links (
        id ${isSQLite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'SERIAL PRIMARY KEY'},
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        position INTEGER DEFAULT 0,
        type VARCHAR(50) DEFAULT 'link'
      );
    `);

    // Performance index: speeds up all queries filtering by user_id
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
    `);

    console.log(`Database inicializado via ${isSQLite ? 'SQLite' : 'PostgreSQL'}.`);
  } catch (err) {
    console.error('Erro ao inicializar o banco:', err);
  }
};

module.exports = { db, init, isSQLite };
