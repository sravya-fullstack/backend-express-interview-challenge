import axios from 'axios';
import { RatingResponse, OMDBResponse } from '../types';

export class RatingService {
  private localApiUrl: string;
  private omdbApiKey: string;
  private omdbUrl = 'https://www.omdbapi.com';

  constructor(localApiUrl: string = 'http://localhost:3000', omdbApiKey: string = '') {
    this.localApiUrl = localApiUrl;
    this.omdbApiKey = omdbApiKey;
  }

  async getLocalRating(imdbId: string): Promise<number | null> {
    try {
      const response = await axios.get<RatingResponse>(
        `${this.localApiUrl}/ratings/${imdbId}`
      );
      return response.data.rating;
    } catch (error) {
      console.warn(`Failed to fetch local rating for ${imdbId}:`, error);
      return null;
    }
  }

  async getRottenTomatoesRating(imdbId: string): Promise<number | null> {
    if (!this.omdbApiKey) {
      console.warn('OMDB API key not configured');
      return null;
    }
    try {
      const response = await axios.get<OMDBResponse>(this.omdbUrl, {
        params: {
          i: imdbId,
          apikey: this.omdbApiKey,
          type: 'movie'
        }
      });
      const rtRating = response.data.Ratings?.find(r => r.Source === 'Rotten Tomatoes');
      if (rtRating && rtRating.Value) {
        return parseInt(rtRating.Value, 10);
      }
    } catch (error) {
      console.warn(`Failed to fetch OMDB rating for ${imdbId}:`, error);
    }
    return null;
  }

  async getRatings(imdbId: string) {
    const [localRating, rottenTomatoesRating] = await Promise.all([
      this.getLocalRating(imdbId),
      this.getRottenTomatoesRating(imdbId)
    ]);
    return {
      local: localRating,
      rottenTomatoes: rottenTomatoesRating
    };
  }
}
