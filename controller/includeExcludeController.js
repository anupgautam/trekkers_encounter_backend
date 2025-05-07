const client = require('../utils/db');

// Posting the IncludeExclude
exports.postIncludeExclude = async (req, res) => {
    let connection;
    try {
        const { title, type } = req.body;

        // Validate required fields
        if (!title || !type) {
            return res.status(400).json({ msg: 'Title and type are required.' });
        }

        connection = await client.getConnection();
        const query = 'INSERT INTO IncludeExclude (title, type) VALUES (?, ?)';
        const values = [title, type];

        const [result] = await connection.query(query, values);
        const savedIncludeExclude = { id: result.insertId, title, type };

        res.status(201).json({ msg: 'Include Exclude Successfully Added.', resp: savedIncludeExclude });
    } catch (error) {
        console.error("Error in postIncludeExclude:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get the IncludeExclude
exports.getIncludeExclude = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM IncludeExclude';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getIncludeExclude:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for IncludeExclude filtering by id
exports.getIncludeExcludeById = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM IncludeExclude WHERE id = ?';
        const values = [req.params.postId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Include Exclude not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getIncludeExcludeById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update the IncludeExclude using id
exports.updateIncludeExclude = async (req, res) => {
    let connection;
    try {
        const { title, type } = req.body;

        // Validate required fields
        if (!title || !type) {
            return res.status(400).json({ msg: 'Title and type are required.' });
        }

        connection = await client.getConnection();
        const query = 'UPDATE IncludeExclude SET title = ?, type = ? WHERE id = ?';
        const values = [title, type, req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Include Exclude not found.' });
        }

        res.status(200).json({ msg: 'Include Exclude updated successfully.', resp: { title, type } });
    } catch (error) {
        console.error("Error in updateIncludeExclude:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete request for IncludeExclude
exports.deleteIncludeExclude = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'DELETE FROM IncludeExclude WHERE id = ?';
        const values = [req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Include Exclude not found.' });
        }

        res.status(200).json({ msg: 'Include Exclude deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteIncludeExclude:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};