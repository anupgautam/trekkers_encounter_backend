const client = require('../utils/db');

// Posting the language
exports.postLanguage = async (req, res) => {
    let connection;
    try {
        const { language } = req.body;

        // Check if required field is provided
        if (!language) {
            return res.status(400).json({ msg: 'Language is required.' });
        }

        connection = await client.getConnection();
        const query = 'INSERT INTO Languages (language) VALUES (?)';
        const values = [language];

        const [result] = await connection.query(query, values);
        const newLanguage = { id: result.insertId, language };

        res.status(201).json({ msg: 'Language Successfully Added.', resp: newLanguage });
    } catch (error) {
        console.error("Error in postLanguage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for the language
exports.getLanguage = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Languages';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getLanguage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for language filtering by id
exports.getLanguageById = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Languages WHERE id = ?';
        const values = [req.params.id];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Language not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getLanguageById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update request for language
exports.updateLanguage = async (req, res) => {
    let connection;
    try {
        const { language } = req.body;

        // Check if required field is provided
        if (!language) {
            return res.status(400).json({ msg: 'Language is required.' });
        }

        connection = await client.getConnection();
        const query = 'UPDATE Languages SET language = ? WHERE id = ?';
        const values = [language, req.params.id];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Language not found.' });
        }

        res.status(200).json({ msg: 'Language updated successfully.', resp: { id: req.params.id, language } });
    } catch (error) {
        console.error("Error in updateLanguage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete request for language
exports.deleteLanguage = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'DELETE FROM Languages WHERE id = ?';
        const values = [req.params.id];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Language not found.' });
        }

        res.status(200).json({ msg: 'Language deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteLanguage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};