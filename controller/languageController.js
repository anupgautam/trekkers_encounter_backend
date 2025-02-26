const mysql = require('../utils/db'); // Assuming this file contains the mysql connection setup

// Posting the language
exports.postLanguage = async (req, res) => {
    try {
        const { language } = req.body;
        const query = 'INSERT INTO Languages (language) VALUES (?)';
        const values = [language];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error', error });
            }
            res.status(201).json({ message: "Language Successfully Added." });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error });
    }
}

// Get request for the language
exports.getLanguage = async (req, res) => {
    try {
        const query = 'SELECT * FROM Languages';

        mysql.query(query, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error', error });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error });
    }
}

// Get request for language filtering by id
exports.getLanguageById = async (req, res) => {
    try {
        const query = 'SELECT * FROM Languages WHERE id = ?';
        const values = [req.params.id];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error', error });
            }
            if (result.length === 0) {
                return res.status(404).json({ msg: 'Language not found' });
            }
            res.status(200).json(result[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error });
    }
}

// Update request for language
exports.updateLanguage = async (req, res) => {
    try {
        const { language } = req.body;
        const query = 'UPDATE Languages SET language = ? WHERE id = ?';
        const values = [language, req.params.id];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error', error });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Language not found' });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error });
    }
}

// Delete request for language
exports.deleteLanguage = async (req, res) => {
    try {
        const query = 'DELETE FROM Languages WHERE id = ?';
        const values = [req.params.id];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error', error });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Language not found' });
            }
            res.status(200).json({ msg: 'Language deleted successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error });
    }
}
