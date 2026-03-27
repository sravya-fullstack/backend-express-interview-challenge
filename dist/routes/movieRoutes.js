"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMovieRoutes = createMovieRoutes;
const express_1 = require("express");
function createMovieRoutes(controller) {
    const router = (0, express_1.Router)();
    router.get('/search/by-year', (req, res) => controller.getMoviesByYear(req, res));
    router.get('/search/by-genre', (req, res) => controller.getMoviesByGenre(req, res));
    router.get('/', (req, res) => controller.getAllMovies(req, res));
    router.get('/:imdbId', (req, res) => controller.getMovieDetails(req, res));
    return router;
}
