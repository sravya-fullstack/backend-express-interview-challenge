import * as fs from "fs";
import initSqlJs, { Database as SqlJsDatabase, Statement } from "sql.js";

type QueryCallback<T> = (err: Error | null, rows: T) => void;
type GetCallback<T> = (err: Error | null, row: T | null) => void;

export type Database = {
  all: (query: string, params: any[], callback: QueryCallback<any[]>) => void;
  get: (query: string, params: any[], callback: GetCallback<any>) => void;
  close: () => void;
};

const toRows = (stmt: Statement): any[] => {
  const rows: any[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  return rows;
};

const createReadonlyDb = async (dbPath: string): Promise<Database> => {
  const SQL = await initSqlJs();
  const dbBuffer = fs.readFileSync(dbPath);
  const sqlDb: SqlJsDatabase = new SQL.Database(dbBuffer);

  return {
    all: (query, params, callback) => {
      try {
        const stmt = sqlDb.prepare(query);
        stmt.bind(params);
        const rows = toRows(stmt);
        stmt.free();
        callback(null, rows);
      } catch (error) {
        callback(error as Error, []);
      }
    },
    get: (query, params, callback) => {
      try {
        const stmt = sqlDb.prepare(query);
        stmt.bind(params);
        const rows = toRows(stmt);
        stmt.free();
        callback(null, rows.length > 0 ? rows[0] : null);
      } catch (error) {
        callback(error as Error, null);
      }
    },
    close: () => sqlDb.close(),
  };
};

export const initDatabase = (): Promise<{
  moviesDB: Database;
  ratingsDB: Database;
}> => {
  return Promise.all([
    createReadonlyDb("./model/movies.db"),
    createReadonlyDb("./model/ratings.db"),
  ]).then(([moviesDB, ratingsDB]) => {
    console.log("Movies database opened successfully");
    console.log("Ratings database opened successfully");
    return { moviesDB, ratingsDB };
  });
};

export const getMoviesDB = (): Promise<Database> => {
  return initDatabase().then(({ moviesDB }) => moviesDB);
};

export const getRatingsDB = (): Promise<Database> => {
  return initDatabase().then(({ ratingsDB }) => ratingsDB);
};

export const closeAllConnections = (dbs: {
  moviesDB: Database;
  ratingsDB: Database;
}): void => {
  dbs.moviesDB.close();
  dbs.ratingsDB.close();
  console.log("All database connections closed");
};
