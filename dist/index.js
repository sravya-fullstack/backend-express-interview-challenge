"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const DatabaseService_1 = require("./services/DatabaseService");
const RatingService_1 = require("./services/RatingService");
const MovieController_1 = require("./controllers/MovieController");
const movieRoutes_1 = require("./routes/movieRoutes");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3005;
const OMDB_API_KEY = process.env.OMDB_API_KEY || "";
const DB_PATH = path_1.default.join(__dirname, "../model/movies.db");
// Initialize services
const dbService = new DatabaseService_1.DatabaseService(DB_PATH);
const ratingService = new RatingService_1.RatingService("http://localhost:3000", OMDB_API_KEY);
const movieController = new MovieController_1.MovieController(dbService, ratingService);
// Middleware
app.use(express_1.default.json());
// Health check
app.get("/heartbeat", (req, res) => {
    res.json({ message: "Movie API is running" });
});
// Routes
app.use("/api/movies", (0, movieRoutes_1.createMovieRoutes)(movieController));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});
// Start server
app.listen(PORT, () => {
    console.log(`Movie API server running on port ${PORT}`);
});
// Graceful shutdown
process.on("SIGINT", () => {
    dbService.close();
    process.exit(0);
});
