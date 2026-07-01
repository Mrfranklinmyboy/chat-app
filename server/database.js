const Database = require('better-sqlite3');

const db = new Database(process.env.NODE_ENV === 'production' ? ':memory:' : './chat.db');

db.pragma('journal_mode = WAL');

// Таблица пользователей
db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Таблица комнат
db.exec(`CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Таблица сообщений
db.exec(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER,
  author TEXT,
  text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id)
)`);

// Создаём дефолтную комнату
const stmt = db.prepare('INSERT OR IGNORE INTO rooms (name) VALUES (?)');
stmt.run('general');

module.exports = db;
