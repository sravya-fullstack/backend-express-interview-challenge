import { Router, Request, Response } from "express";
import * as movies from "./controllers/movies.controller";

const router = Router();

// A route to check the health of the API
router.get("/heartbeat", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the movie API!" });
});

// A route to get a movie by id
router.get("/movies/:id", (req: Request, res: Response) => {
  movies.getMovieById(req, res);
});

// A route to get all movies
router.get("/movies", (req: Request, res: Response) => {
  movies.getMovies(req, res);
});

export default router;
