import { getAllMovies, getMovieById } from "../../src/services/movies";
import { getMoviesDB } from "../../src/db/connections";

// Mock the database connection
jest.mock("../../src/db/connections");
const mockGetMoviesDB = getMoviesDB as jest.MockedFunction<typeof getMoviesDB>;

describe("Movies Service", () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      all: jest.fn(),
      get: jest.fn(),
    };
    mockGetMoviesDB.mockResolvedValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // NOTE: Here are some tests to get you started.
  // Please note that writing your own automated tests is not required for this task,
  // but you can use them to help understand your code's testability and functionality.

  describe("getAllMovies", () => {
    it("should return all movies successfully", async () => {
      const mockMovies = [
        { movieId: 1, title: "Test Movie 1", year: 2020 },
        { movieId: 2, title: "Test Movie 2", year: 2021 },
      ];

      mockDb.all.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockMovies);
        }
      );

      const result = await getAllMovies();
      expect(result).toEqual(mockMovies);
    });

    it("should handle database errors", async () => {
      const mockError = new Error("Database connection failed");

      mockDb.all.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(mockError, null);
        }
      );

      await expect(getAllMovies()).rejects.toThrow(
        "Database connection failed"
      );
    });

    it("should return empty array when no movies found", async () => {
      mockDb.all.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, []);
        }
      );

      const result = await getAllMovies();

      expect(result).toEqual([]);
    });
  });

  describe("getMovieById", () => {
    it("should return a movie by id successfully", async () => {
      const mockMovie = { movieId: 1, title: "Test Movie", year: 2020 };

      mockDb.get.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockMovie);
        }
      );

      const result = await getMovieById(1);

      expect(mockDb.get).toHaveBeenCalledWith(
        "SELECT * FROM movies WHERE movieId = ?;",
        [1],
        expect.any(Function)
      );
      expect(result).toEqual(mockMovie);
    });

    it("should display budget in USD format", async () => {
      const mockMovie = {
        movieId: 1,
        title: "Test Movie",
        year: 2020,
        budget: 50000000,
      };

      mockDb.get.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, mockMovie);
        }
      );

      const result = await getMovieById(1);
      expect(result.budget).toBe("$50,000,000");
    });

    it("should return null when movie not found", async () => {
      mockDb.get.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(null, null);
        }
      );

      const result = await getMovieById(999);

      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      const mockError = new Error("Database query failed");

      mockDb.get.mockImplementation(
        (query: string, params: any[], callback: Function) => {
          callback(mockError, null);
        }
      );

      await expect(getMovieById(1)).rejects.toThrow("Database query failed");
    });
  });
});
