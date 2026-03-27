import { Router } from 'express';
import { MovieController } from '../controllers/MovieController';

export function createMovieRoutes(controller: MovieController): Router {
  const router = Router();

  router.get('/search/by-year', (req, res) => controller.getMoviesByYear(req, res));
  router.get('/search/by-genre', (req, res) => controller.getMoviesByGenre(req, res));
  router.get('/', (req, res) => controller.getAllMovies(req, res));
  router.get('/:imdbId', (req, res) => controller.getMovieDetails(req, res));

  return router;
}
