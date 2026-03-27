"use strict";

import { getMoviesDB } from "../db/connections";
import { formatUsd } from "../utils/money";

export const getAllMovies = async (): Promise<any[]> => {
  const query = "SELECT * FROM movies LIMIT 50 OFFSET 0;";

  const db = await getMoviesDB();

  return new Promise((resolve, reject) => {
    db.all(query, [], (err: Error | null, rows: any[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
};

export const getMovieById = async (id: number): Promise<any> => {
  const query = "SELECT * FROM movies WHERE movieId = ?;";

  const db = await getMoviesDB();

  return new Promise((resolve, reject) => {
    db.get(query, [id], (err: Error | null, row: any) => {
      if (err) {
        reject(err);
      } else {
        if (!row) {
          resolve(null);
          return;
        }
        resolve({
          ...row,
          budget: formatUsd(row.budget),
        });
      }
    });
  });
};
