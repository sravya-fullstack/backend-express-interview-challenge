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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingService = void 0;
const axios_1 = __importDefault(require("axios"));
class RatingService {
    constructor(localApiUrl = 'http://localhost:3000', omdbApiKey = '') {
        this.omdbUrl = 'https://www.omdbapi.com';
        this.localApiUrl = localApiUrl;
        this.omdbApiKey = omdbApiKey;
    }
    getLocalRating(imdbId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.localApiUrl}/ratings/${imdbId}`);
                return response.data.rating;
            }
            catch (error) {
                console.warn(`Failed to fetch local rating for ${imdbId}:`, error);
                return null;
            }
        });
    }
    getRottenTomatoesRating(imdbId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.omdbApiKey) {
                console.warn('OMDB API key not configured');
                return null;
            }
            try {
                const response = yield axios_1.default.get(this.omdbUrl, {
                    params: {
                        i: imdbId,
                        apikey: this.omdbApiKey,
                        type: 'movie'
                    }
                });
                const rtRating = (_a = response.data.Ratings) === null || _a === void 0 ? void 0 : _a.find(r => r.Source === 'Rotten Tomatoes');
                if (rtRating && rtRating.Value) {
                    return parseInt(rtRating.Value, 10);
                }
            }
            catch (error) {
                console.warn(`Failed to fetch OMDB rating for ${imdbId}:`, error);
            }
            return null;
        });
    }
    getRatings(imdbId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [localRating, rottenTomatoesRating] = yield Promise.all([
                this.getLocalRating(imdbId),
                this.getRottenTomatoesRating(imdbId)
            ]);
            return {
                local: localRating,
                rottenTomatoes: rottenTomatoesRating
            };
        });
    }
}
exports.RatingService = RatingService;
