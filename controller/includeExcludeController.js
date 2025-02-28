const mysql = require('../utils/db'); // Import your MySQL client

// Posting the IncludeExclude
exports.postIncludeExclude = async (req, res) => {
    try {
        const query = 'INSERT INTO IncludeExclude (title, type) VALUES (?, ?)';
        const values = [req.body.title, req.body.type];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            const savedIncludeExclude = { id: result.insertId, title: req.body.title, type: req.body.type };

            res.status(201).json({ msg: 'Include Exclude Successfully Added.', resp: savedIncludeExclude });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Get the IncludeExclude
exports.getIncludeExclude = async (req, res) => {
    try {
        const query = 'SELECT * FROM IncludeExclude';

        mysql.query(query, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Get request for IncludeExclude filtering by id
exports.getIncludeExcludeById = async (req, res) => {
    try {
        const query = 'SELECT * FROM IncludeExclude WHERE id = ?';
        const values = [req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ msg: 'Include Exclude not found.' });
            }

            res.status(200).json(result[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Update the IncludeExclude using id
exports.updateIncludeExclude = async (req, res) => {
    try {
        const query = 'UPDATE IncludeExclude SET title = ?, type = ? WHERE id = ?';
        const values = [req.body.title, req.body.type, req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Include Exclude not found.' });
            }

            res.status(200).json({ msg: 'Include Exclude updated successfully.', resp: { title: req.body.title, type: req.body.type } });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Delete request for IncludeExclude
exports.deleteIncludeExclude = async (req, res) => {
    try {
        const query = 'DELETE FROM IncludeExclude WHERE id = ?';
        const values = [req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Include Exclude not found.' });
            }

            res.status(200).json({ msg: 'Include Exclude deleted successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};
