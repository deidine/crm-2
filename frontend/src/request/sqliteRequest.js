// services/sqliteRequest.ts
import { getDb } from '@/database/db';
import errorHandler from './errorHandler';
import successHandler from './successHandler';

const sqliteRequest = {
  create: async ({ entity, jsonData }) => {
    try {
      const db = await getDb();
      const keys = Object.keys(jsonData).join(', ');
      const placeholders = Object.keys(jsonData).map(() => '?').join(', ');
      const values = Object.values(jsonData);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS ${entity} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ${Object.keys(jsonData).map(k => `${k} TEXT`).join(', ')}
        );
      `);

      await db.run(
        `INSERT INTO ${entity} (${keys}) VALUES (${placeholders})`,
        values
      );

      successHandler({ message: 'Local create successful' });
      return { success: true };
    } catch (error) {
      return errorHandler(error);
    }
  },

  read: async ({ entity, id }) => {
    try {
      const db = await getDb();
      const result = await db.query(`SELECT * FROM ${entity} WHERE id = ?`, [id]);
      return result.values[0];
    } catch (error) {
      return errorHandler(error);
    }
  },

  update: async ({ entity, id, jsonData }) => {
    try {
      const db = await getDb();
      const setClause = Object.keys(jsonData)
        .map(k => `${k} = ?`)
        .join(', ');
      const values = [...Object.values(jsonData), id];

      await db.run(
        `UPDATE ${entity} SET ${setClause} WHERE id = ?`,
        values
      );

      successHandler({ message: 'Local update successful' });
      return { success: true };
    } catch (error) {
      return errorHandler(error);
    }
  },

  delete: async ({ entity, id }) => {
    try {
      const db = await getDb();
      await db.run(`DELETE FROM ${entity} WHERE id = ?`, [id]);
      successHandler({ message: 'Local delete successful' });
      return { success: true };
    } catch (error) {
      return errorHandler(error);
    }
  },

  list: async ({ entity }) => {
    try {
      const db = await getDb();
      const result = await db.query(`SELECT * FROM ${entity}`);
      return result.values;
    } catch (error) {
      return errorHandler(error);
    }
  },
};

export default sqliteRequest;
