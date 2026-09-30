import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

let databasePromise: Promise<SQLiteDatabase> | null = null;
let migrationPromise: Promise<void> | null = null;

export function getDatabase(): Promise<SQLiteDatabase> {
  if (!databasePromise) databasePromise = openDatabaseAsync('minhas-series.db');
  return databasePromise;
}

export function runMigrations(): Promise<void> {
  if (!migrationPromise) {
    migrationPromise = (async () => {
      const db = await getDatabase();
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS series (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          plataforma TEXT NOT NULL,
          temporadas INTEGER NOT NULL,
          nota INTEGER,
          concluida INTEGER NOT NULL DEFAULT 0,
          createdAt TEXT NOT NULL
        );
      `);
    })();
  }
  return migrationPromise;
}
