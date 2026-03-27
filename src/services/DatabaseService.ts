import * as fs from "fs";
import initSqlJs, { Database } from "sql.js";
import { Movie, MovieDetails } from '../types';
import { formatUsd } from '../utils/money';

export class DatabaseService {
  private dbPath: string;
  private dbPromise: Promise<Database>;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    this.dbPromise = this.initializeDb();
  }

  private async initializeDb(): Promise<Database> {
    const SQL = await initSqlJs();
    const dbFile = fs.readFileSync(this.dbPath);
    return new SQL.Database(dbFile);
  }

  private async all(sql: string, params: any[] = []): Promise<any[]> {
    const db = await this.dbPromise;
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows: any[] = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  }

  private async get(sql: string, params: any[] = []): Promise<any> {
    const rows = await this.all(sql, params);
    return rows.length > 0 ? rows[0] : null;
  }

  async getAllMovies(page: number = 1, pageSize: number = 50): Promise<{ movies: Movie[]; total: number }> {
    const offset = (page - 1) * pageSize;
    const rows = await this.all(
      'SELECT imdbId, title, genres, releaseDate, budget FROM movies LIMIT ? OFFSET ?',
      [pageSize, offset]
    );
    const movies: Movie[] = rows.map((r: any) => ({
      ...r,
      budget: formatUsd(r.budget),
    }));
    const countResult = await this.get('SELECT COUNT(*) as count FROM movies');
    return { movies, total: countResult.count };
  }

  async getMovieById(imdbId: string): Promise<MovieDetails | null> {
    const row = await this.get(
      `SELECT 
        imdbId,
        title,
        overview as description,
        releaseDate,
        budget, 
        runtime, 
        language as originalLanguage, 
        productionCompanies,
        genres
      FROM movies WHERE imdbId = ?`,
      [imdbId]
    );
    if (!row) return null;
    return {
      ...row,
      budget: formatUsd(row.budget),
    } as MovieDetails;
  }

  async getMoviesByYear(year: number, page: number = 1, pageSize: number = 50, sortDesc: boolean = false): Promise<{ movies: Movie[]; total: number }> {
    const offset = (page - 1) * pageSize;
    const sortOrder = sortDesc ? 'DESC' : 'ASC';
    const rows = await this.all(
      `SELECT imdbId, title, genres, releaseDate, budget 
       FROM movies 
       WHERE substr(releaseDate, 1, 4) = ? 
       ORDER BY releaseDate ${sortOrder} 
       LIMIT ? OFFSET ?`,
      [year.toString(), pageSize, offset]
    );
    const movies: Movie[] = rows.map((r: any) => ({
      ...r,
      budget: formatUsd(r.budget),
    }));
    const countResult = await this.get(
      "SELECT COUNT(*) as count FROM movies WHERE substr(releaseDate, 1, 4) = ?",
      [year.toString()]
    );
    return { movies, total: countResult.count };
  }

  async getMoviesByGenre(genre: string, page: number = 1, pageSize: number = 50): Promise<{ movies: Movie[]; total: number }> {
    const offset = (page - 1) * pageSize;
    const rows = await this.all(
      `SELECT imdbId, title, genres, releaseDate, budget 
       FROM movies 
       WHERE genres LIKE ? 
       LIMIT ? OFFSET ?`,
      [`%${genre}%`, pageSize, offset]
    );
    const movies: Movie[] = rows.map((r: any) => ({
      ...r,
      budget: formatUsd(r.budget),
    }));
    const countResult = await this.get(
      'SELECT COUNT(*) as count FROM movies WHERE genres LIKE ?',
      [`%${genre}%`]
    );
    return { movies, total: countResult.count };
  }

  close(): void {
    void this.dbPromise.then((db) => db.close());
  }
}
