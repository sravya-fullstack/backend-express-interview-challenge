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
exports.closeAllConnections = exports.getRatingsDB = exports.getMoviesDB = exports.initDatabase = void 0;
const fs = __importStar(require("fs"));
const sql_js_1 = __importDefault(require("sql.js"));
const toRows = (stmt) => {
    const rows = [];
    while (stmt.step()) {
        rows.push(stmt.getAsObject());
    }
    return rows;
};
const createReadonlyDb = (dbPath) => __awaiter(void 0, void 0, void 0, function* () {
    const SQL = yield (0, sql_js_1.default)();
    const dbBuffer = fs.readFileSync(dbPath);
    const sqlDb = new SQL.Database(dbBuffer);
    return {
        all: (query, params, callback) => {
            try {
                const stmt = sqlDb.prepare(query);
                stmt.bind(params);
                const rows = toRows(stmt);
                stmt.free();
                callback(null, rows);
            }
            catch (error) {
                callback(error, []);
            }
        },
        get: (query, params, callback) => {
            try {
                const stmt = sqlDb.prepare(query);
                stmt.bind(params);
                const rows = toRows(stmt);
                stmt.free();
                callback(null, rows.length > 0 ? rows[0] : null);
            }
            catch (error) {
                callback(error, null);
            }
        },
        close: () => sqlDb.close(),
    };
});
const initDatabase = () => {
    return Promise.all([
        createReadonlyDb("./model/movies.db"),
        createReadonlyDb("./model/ratings.db"),
    ]).then(([moviesDB, ratingsDB]) => {
        console.log("Movies database opened successfully");
        console.log("Ratings database opened successfully");
        return { moviesDB, ratingsDB };
    });
};
exports.initDatabase = initDatabase;
const getMoviesDB = () => {
    return (0, exports.initDatabase)().then(({ moviesDB }) => moviesDB);
};
exports.getMoviesDB = getMoviesDB;
const getRatingsDB = () => {
    return (0, exports.initDatabase)().then(({ ratingsDB }) => ratingsDB);
};
exports.getRatingsDB = getRatingsDB;
const closeAllConnections = (dbs) => {
    dbs.moviesDB.close();
    dbs.ratingsDB.close();
    console.log("All database connections closed");
};
exports.closeAllConnections = closeAllConnections;
