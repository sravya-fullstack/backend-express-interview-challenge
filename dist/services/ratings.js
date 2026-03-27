'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRating = void 0;
const getRating = (db, req, res) => {
    const query = 'SELECT * FROM ratings WHERE movieId = ?';
    db.all(query, [31], (err, rows) => {
        if (err) {
            res.status(500).send(JSON.stringify(err));
            return; // Ensure to return after sending a response
        }
        if (rows.length === 0) {
            res.status(404).send('No ratings found'); // Send a response for 404
            return; // Ensure to return after sending a response
        }
        res.send(rows);
    });
};
exports.getRating = getRating;
