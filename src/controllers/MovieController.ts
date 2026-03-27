import { Request, Response } from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { RatingService } from '../services/RatingService';
import { PaginatedResponse, MovieDetails } from '../types';

export class MovieController {
  constructor(
    private dbService: DatabaseService,
    private ratingService: RatingService
  ) {}

  async getAllMovies(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 50;

    const { movies, total } = await this.dbService.getAllMovies(page, pageSize);
    const response: PaginatedResponse<typeof movies[0]> = {
      data: movies,
      page,
      pageSize,
      totalCount: total
    };
    res.json(response);
  }

  async getMovieDetails(req: Request, res: Response): Promise<void> {
    const imdbId = String((req.params as any).imdbId);
    const movie = await this.dbService.getMovieById(imdbId);

    if (!movie) {
      res.status(404).json({ error: 'Movie not found' });
      return;
    }

    const ratings = await this.ratingService.getRatings(imdbId);
    const averageRating = [ratings.local, ratings.rottenTomatoes]
      .filter(r => r !== null)
      .reduce((sum, r) => sum + r, 0) / ([ratings.local, ratings.rottenTomatoes].filter(r => r !== null).length || 1);

    const response: MovieDetails = {
      ...movie,
      averageRating: averageRating || undefined,
      ratings: {
        local: ratings.local || undefined,
        rottenTomatoes: ratings.rottenTomatoes || undefined
      }
    };
    res.json(response);
  }

  async getMoviesByYear(req: Request, res: Response): Promise<void> {
    const year = parseInt(req.query.year as string);
    const page = parseInt(req.query.page as string) || 1;
    const sortDesc = req.query.sort === 'desc';
    const pageSize = 50;

    if (!year || isNaN(year)) {
      res.status(400).json({ error: 'Year query parameter is required and must be a number' });
      return;
    }

    const { movies, total } = await this.dbService.getMoviesByYear(year, page, pageSize, sortDesc);
    const response: PaginatedResponse<typeof movies[0]> = {
      data: movies,
      page,
      pageSize,
      totalCount: total
    };
    res.json(response);
  }

  async getMoviesByGenre(req: Request, res: Response): Promise<void> {
    const genre = req.query.genre as string;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 50;

    if (!genre) {
      res.status(400).json({ error: 'Genre query parameter is required' });
      return;
    }

    const { movies, total } = await this.dbService.getMoviesByGenre(genre, page, pageSize);
    const response: PaginatedResponse<typeof movies[0]> = {
      data: movies,
      page,
      pageSize,
      totalCount: total
    };
    res.json(response);
  }
}
