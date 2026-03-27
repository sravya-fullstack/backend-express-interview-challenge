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
exports.getMovieById = exports.getAllMovies = void 0;
const connections_1 = require("../db/connections");
const money_1 = require("../utils/money");
const getAllMovies = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT * FROM movies LIMIT 50 OFFSET 0;";
    const db = yield (0, connections_1.getMoviesDB)();
    return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows || []);
            }
        });
    });
});
exports.getAllMovies = getAllMovies;
const getMovieById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "SELECT * FROM movies WHERE movieId = ?;";
    const db = yield (0, connections_1.getMoviesDB)();
    return new Promise((resolve, reject) => {
        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                if (!row) {
                    resolve(null);
                    return;
                }
                resolve(Object.assign(Object.assign({}, row), { budget: (0, money_1.formatUsd)(row.budget) }));
            }
        });
    });
});
exports.getMovieById = getMovieById;
