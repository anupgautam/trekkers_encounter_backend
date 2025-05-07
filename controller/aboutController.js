const client = require('../utils/db'); // Import your MySQL pool

// Posting the About
exports.postAbout = async (req, res) => {
    let connection;
    try {
        const { title, short_description, description, language_id } = req.body;

        connection = await client.getConnection(); // Acquire a connection from the pool
        const query = `INSERT INTO About (title, short_description, description, language_id) VALUES (?, ?, ?, ?)`;
        const values = [title, short_description, description, language_id];

        const [result] = await connection.query(query, values);
        res.status(201).json({ msg: 'Successfully Added About.' });
    } catch (error) {
        console.error("Error in postAbout:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
};

// Get the About
exports.getAbout = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection(); // Acquire a connection
        const query = 'SELECT * FROM About';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getAbout:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for About filtering by id
exports.getAboutById = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM About WHERE id = ?';
        const values = [req.params.postId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'About not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getAboutById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for About filtering by language_id
exports.getAboutByLanguage = async (req, res) => {
    let connection;
    try {
        const language_id = req.params.language_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM About WHERE language_id = ?';
        const values = [language_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getAboutByLanguage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update request for About
exports.updateAbout = async (req, res) => {
    let connection;
    try {
        const { title, short_description, description, language_id } = req.body;
        connection = await client.getConnection();
        const query = 'UPDATE About SET title = ?, short_description = ?, description = ?, language_id = ? WHERE id = ?';
        const values = [title, short_description, description, language_id, req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'About not found.' });
        }

        res.status(200).json({ msg: 'About updated successfully.' });
    } catch (error) {
        console.error("Error in updateAbout:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete request for About
exports.deleteAbout = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'DELETE FROM About WHERE id = ?';
        const values = [req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'About not found.' });
        }

        res.status(200).json({ msg: 'About deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteAbout:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};