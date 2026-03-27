"use strict";

import express from "express";
import path from "path";
import { DatabaseService } from "./services/DatabaseService";
import { RatingService } from "./services/RatingService";
import { MovieController } from "./controllers/MovieController";
import { createMovieRoutes } from "./routes/movieRoutes";

const app = express();
const PORT = process.env.PORT || 3005;
const OMDB_API_KEY = process.env.OMDB_API_KEY || "";
const DB_PATH = path.join(__dirname, "../model/movies.db");

// Initialize services
const dbService = new DatabaseService(DB_PATH);
const ratingService = new RatingService("http://localhost:3000", OMDB_API_KEY);
const movieController = new MovieController(dbService, ratingService);

// Middleware
app.use(express.json());

// Health check
app.get("/heartbeat", (req, res) => {
  res.json({ message: "Movie API is running" });
});

// Routes
app.use("/api/movies", createMovieRoutes(movieController));

// Error handling middleware
app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Movie API server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  dbService.close();
  process.exit(0);
});
