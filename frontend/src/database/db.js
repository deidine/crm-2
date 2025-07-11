// database/db.ts
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;

export async function getDb() {
  if (!db) {
    db = await sqlite.createConnection('appdb', false, 'no-encryption', 1);
    await db.open();
  }
  return db;
}
