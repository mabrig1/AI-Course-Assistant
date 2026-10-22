/**
 * SQLite database setup for offline storage.
 * Will be expanded with real migrations, embeddings table, etc.
 */

import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDB() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("noun_ai_assistant.db");
  await initSchema(db);
  return db;
}

async function initSchema(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      moodle_course_id INTEGER,
      title TEXT,
      code TEXT,
      last_synced_at INTEGER,
      download_status TEXT,
      total_size_bytes INTEGER
    );

    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      course_id TEXT,
      title TEXT,
      type TEXT,
      local_path TEXT,
      page_count INTEGER,
      downloaded_at INTEGER,
      FOREIGN KEY(course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS chunks (
      id TEXT PRIMARY KEY,
      material_id TEXT,
      course_id TEXT,
      content TEXT,
      page_number INTEGER,
      section_title TEXT,
      chunk_index INTEGER,
      embedding BLOB
    );

    CREATE TABLE IF NOT EXISTS qa_history (
      id TEXT PRIMARY KEY,
      course_id TEXT,
      question TEXT,
      answer TEXT,
      citations TEXT,
      created_at INTEGER,
      was_offline INTEGER
    );

    CREATE TABLE IF NOT EXISTS tutor_queue (
      id TEXT PRIMARY KEY,
      course_id TEXT,
      question TEXT,
      context_snippet TEXT,
      status TEXT,
      created_at INTEGER,
      sent_at INTEGER,
      tutor_reply TEXT
    );
  `);
}

export async function closeDB() {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
