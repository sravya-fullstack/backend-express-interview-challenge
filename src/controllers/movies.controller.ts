import { Request, Response } from "express";
import * as movieService from "../services/movies";

export const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await movieService.getAllMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const movie = await movieService.getMovieById(Number(String((req.params as any).id)));
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
