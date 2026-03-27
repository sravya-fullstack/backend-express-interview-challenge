"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.DatabaseService = void 0;
const fs = __importStar(require("fs"));
const sql_js_1 = __importDefault(require("sql.js"));
const money_1 = require("../utils/money");
class DatabaseService {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.dbPromise = this.initializeDb();
    }
    initializeDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const SQL = yield (0, sql_js_1.default)();
            const dbFile = fs.readFileSync(this.dbPath);
            return new SQL.Database(dbFile);
        });
    }
    all(sql_1) {
        return __awaiter(this, arguments, void 0, function* (sql, params = []) {
            const db = yield this.dbPromise;
            const stmt = db.prepare(sql);
            stmt.bind(params);
            const rows = [];
            while (stmt.step()) {
                rows.push(stmt.getAsObject());
            }
            stmt.free();
            return rows;
        });
    }
    get(sql_1) {
        return __awaiter(this, arguments, void 0, function* (sql, params = []) {
            const rows = yield this.all(sql, params);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    getAllMovies() {
        return __awaiter(this, arguments, void 0, function* (page = 1, pageSize = 50) {
            const offset = (page - 1) * pageSize;
            const rows = yield this.all('SELECT imdbId, title, genres, releaseDate, budget FROM movies LIMIT ? OFFSET ?', [pageSize, offset]);
            const movies = rows.map((r) => (Object.assign(Object.assign({}, r), { budget: (0, money_1.formatUsd)(r.budget) })));
            const countResult = yield this.get('SELECT COUNT(*) as count FROM movies');
            return { movies, total: countResult.count };
        });
    }
    getMovieById(imdbId) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.get(`SELECT 
        imdbId,
        title,
        overview as description,
        releaseDate,
        budget, 
        runtime, 
        language as originalLanguage, 
        productionCompanies,
        genres
      FROM movies WHERE imdbId = ?`, [imdbId]);
            if (!row)
                return null;
            return Object.assign(Object.assign({}, row), { budget: (0, money_1.formatUsd)(row.budget) });
        });
    }
    getMoviesByYear(year_1) {
        return __awaiter(this, arguments, void 0, function* (year, page = 1, pageSize = 50, sortDesc = false) {
            const offset = (page - 1) * pageSize;
            const sortOrder = sortDesc ? 'DESC' : 'ASC';
            const rows = yield this.all(`SELECT imdbId, title, genres, releaseDate, budget 
       FROM movies 
       WHERE substr(releaseDate, 1, 4) = ? 
       ORDER BY releaseDate ${sortOrder} 
       LIMIT ? OFFSET ?`, [year.toString(), pageSize, offset]);
            const movies = rows.map((r) => (Object.assign(Object.assign({}, r), { budget: (0, money_1.formatUsd)(r.budget) })));
            const countResult = yield this.get("SELECT COUNT(*) as count FROM movies WHERE substr(releaseDate, 1, 4) = ?", [year.toString()]);
            return { movies, total: countResult.count };
        });
    }
    getMoviesByGenre(genre_1) {
        return __awaiter(this, arguments, void 0, function* (genre, page = 1, pageSize = 50) {
            const offset = (page - 1) * pageSize;
            const rows = yield this.all(`SELECT imdbId, title, genres, releaseDate, budget 
       FROM movies 
       WHERE genres LIKE ? 
       LIMIT ? OFFSET ?`, [`%${genre}%`, pageSize, offset]);
            const movies = rows.map((r) => (Object.assign(Object.assign({}, r), { budget: (0, money_1.formatUsd)(r.budget) })));
            const countResult = yield this.get('SELECT COUNT(*) as count FROM movies WHERE genres LIKE ?', [`%${genre}%`]);
            return { movies, total: countResult.count };
        });
    }
    close() {
        void this.dbPromise.then((db) => db.close());
    }
}
exports.DatabaseService = DatabaseService;
