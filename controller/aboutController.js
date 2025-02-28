const client = require('../utils/db'); // Import your PostgreSQL client

// Posting the About
exports.postAbout = async (req, res) => {
    try {
        const { title, short_description, description, language_id } = req.body;

        const query = `INSERT INTO About (title, short_description, description, language_id) VALUES (?, ?, ?, ?)`;
        const values = [title, short_description, description, language_id];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            res.status(201).json({ msg: 'Successfully Added About.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Get the About
exports.getAbout = async (req, res) => {
    try {
        const query = 'SELECT * FROM About';

        client.query(query, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Get request for About filtering by id
exports.getAboutById = async (req, res) => {
    try {
        const query = 'SELECT * FROM About WHERE id = ?';
        const values = [req.params.postId];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ msg: 'About not found.' });
            }

            res.status(200).json(results[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


exports.getAboutByLanguage = async (req, res) => {
    try {
        const language_id = req.params.language_id;
        const query = 'SELECT * FROM About WHERE language_id = ?';
        const values = [language_id];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Update request for About
exports.updateAbout = async (req, res) => {
    try {
        const { title, short_description, description, language_id } = req.body;
        const query = 'UPDATE About SET title = ?, short_description = ?, description = ?, language_id = ? WHERE id = ?';
        const values = [title, short_description, description, language_id, req.params.postId];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: 'About not found.' });
            }

            res.status(200).json({ msg: 'About updated successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Delete request for About
exports.deleteAbout = async (req, res) => {
    try {
        const query = 'DELETE FROM About WHERE id = ?';
        const values = [req.params.postId];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: 'About not found.' });
            }

            res.status(200).json({ msg: 'About deleted successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

