const mysql = require('../utils/db'); // Assuming mysql2 or mysql is used for MySQL connection

// Posting essential information
exports.postEssential = async (req, res) => {
    try {
        const { package_id, title, description } = req.body;

        // Check if required fields are provided
        if (!package_id || !title || !description) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        const query = `
            INSERT INTO EssentialInformation (package_id, title, description)
            VALUES (?, ?, ?)`;

        const values = [package_id, title, description];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            const newEssential = { id: result.insertId, ...req.body };
            res.status(201).json({ msg: 'Essential Information Successfully Added.', resp: newEssential });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Bulk posting essential information
exports.postBulkEssential = async (req, res) => {
    try {
        const { package_id, essentialItems } = req.body;

        // Check if essentialItems is an array
        if (!Array.isArray(essentialItems)) {
            return res.status(400).json({ msg: 'essentialItems should be an array.' });
        }

        const savedEssentialItems = [];

        for (const item of essentialItems) {
            const { title, description } = item;

            // Check if required fields are provided for each item
            if (!title || !description) {
                return res.status(400).json({ msg: 'Missing required fields in one or more items.' });
            }

            const query = `
                INSERT INTO EssentialInformation (package_id, title, description)
                VALUES (?, ?, ?)`;

            const values = [package_id, title, description];

            mysql.query(query, values, (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ msg: 'Server Error.', error: error.message });
                }
                savedEssentialItems.push({ id: result.insertId, ...item });
            });
        }

        res.status(201).json({ msg: 'Bulk Essential Information Successfully Added.', resp: savedEssentialItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Get essential information
exports.getEssential = async (req, res) => {
    try {
        const query = 'SELECT * FROM EssentialInformation';

        mysql.query(query, (error, results) => {
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

// Get essential information by ID
exports.getEssentialById = async (req, res) => {
    try {
        const essentialId = req.params.postId;
        const query = 'SELECT * FROM EssentialInformation WHERE id = ?';
        const values = [essentialId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ msg: 'Essential Information not found.' });
            }
            res.status(200).json(result[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Get essential information by package ID
exports.getEssentialByPackageId = async (req, res) => {
    try {
        const package_id = req.params.package_id;
        const query = 'SELECT * FROM EssentialInformation WHERE package_id = ?';
        const values = [package_id];

        mysql.query(query, values, (error, result) => {
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

// Update essential information by ID
exports.updateEssential = async (req, res) => {
    try {
        const essentialId = req.params.postId;
        const { package_id, title, description } = req.body;

        // Check if required fields are provided
        if (!package_id || !title || !description) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        const query = `
            UPDATE EssentialInformation
            SET package_id = ?, title = ?, description = ?
            WHERE id = ?
            LIMIT 1`;

        const values = [package_id, title, description, essentialId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Essential Information not found.' });
            }
            res.status(200).json({ msg: 'Essential Information updated successfully.', resp: req.body });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Delete essential information by ID
exports.deleteEssential = async (req, res) => {
    try {
        const essentialId = req.params.postId;
        const query = 'DELETE FROM EssentialInformation WHERE id = ?';
        const values = [essentialId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Essential Information not found.' });
            }
            res.status(200).json({ msg: 'Essential Information deleted successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};
