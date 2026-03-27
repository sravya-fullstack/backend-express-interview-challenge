"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieController = void 0;
class MovieController {
    constructor(dbService, ratingService) {
        this.dbService = dbService;
        this.ratingService = ratingService;
    }
    getAllMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = parseInt(req.query.page) || 1;
            const pageSize = 50;
            const { movies, total } = yield this.dbService.getAllMovies(page, pageSize);
            const response = {
                data: movies,
                page,
                pageSize,
                totalCount: total
            };
            res.json(response);
        });
    }
    getMovieDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const imdbId = String(req.params.imdbId);
            const movie = yield this.dbService.getMovieById(imdbId);
            if (!movie) {
                res.status(404).json({ error: 'Movie not found' });
                return;
            }
            const ratings = yield this.ratingService.getRatings(imdbId);
            const averageRating = [ratings.local, ratings.rottenTomatoes]
                .filter(r => r !== null)
                .reduce((sum, r) => sum + r, 0) / ([ratings.local, ratings.rottenTomatoes].filter(r => r !== null).length || 1);
            const response = Object.assign(Object.assign({}, movie), { averageRating: averageRating || undefined, ratings: {
                    local: ratings.local || undefined,
                    rottenTomatoes: ratings.rottenTomatoes || undefined
                } });
            res.json(response);
        });
    }
    getMoviesByYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const year = parseInt(req.query.year);
            const page = parseInt(req.query.page) || 1;
            const sortDesc = req.query.sort === 'desc';
            const pageSize = 50;
            if (!year || isNaN(year)) {
                res.status(400).json({ error: 'Year query parameter is required and must be a number' });
                return;
            }
            const { movies, total } = yield this.dbService.getMoviesByYear(year, page, pageSize, sortDesc);
            const response = {
                data: movies,
                page,
                pageSize,
                totalCount: total
            };
            res.json(response);
        });
    }
    getMoviesByGenre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const genre = req.query.genre;
            const page = parseInt(req.query.page) || 1;
            const pageSize = 50;
            if (!genre) {
                res.status(400).json({ error: 'Genre query parameter is required' });
                return;
            }
            const { movies, total } = yield this.dbService.getMoviesByGenre(genre, page, pageSize);
            const response = {
                data: movies,
                page,
                pageSize,
                totalCount: total
            };
            res.json(response);
        });
    }
}
exports.MovieController = MovieController;
