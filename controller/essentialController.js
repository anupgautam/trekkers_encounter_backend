const client = require('../utils/db');

// Posting essential information
exports.postEssential = async (req, res) => {
    let connection;
    try {
        const { package_id, title, description } = req.body;

        // Check if required fields are provided
        if (!package_id || !title || !description) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        connection = await client.getConnection();
        const query = `
            INSERT INTO EssentialInformation (package_id, title, description)
            VALUES (?, ?, ?)`;
        const values = [package_id, title, description];

        const [result] = await connection.query(query, values);
        const newEssential = { id: result.insertId, ...req.body };
        res.status(201).json({ msg: 'Essential Information Successfully Added.', resp: newEssential });
    } catch (error) {
        console.error("Error in postEssential:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Bulk posting essential information
exports.postBulkEssential = async (req, res) => {
    let connection;
    try {
        const { package_id, essentialItems } = req.body;

        // Check if essentialItems is an array
        if (!Array.isArray(essentialItems)) {
            return res.status(400).json({ msg: 'essentialItems should be an array.' });
        }

        if (!package_id) {
            return res.status(400).json({ msg: 'Package ID is required.' });
        }

        const savedEssentialItems = [];
        connection = await client.getConnection();

        // Process all items concurrently
        const insertPromises = essentialItems.map(async (item) => {
            const { title, description } = item;

            // Check if required fields are provided for each item
            if (!title || !description) {
                throw new Error('Missing required fields in one or more items.');
            }

            const query = `
                INSERT INTO EssentialInformation (package_id, title, description)
                VALUES (?, ?, ?)`;
            const values = [package_id, title, description];

            const [result] = await connection.query(query, values);
            return { id: result.insertId, ...item };
        });

        // Wait for all inserts to complete
        const results = await Promise.all(insertPromises);
        savedEssentialItems.push(...results);

        res.status(201).json({ msg: 'Bulk Essential Information Successfully Added.', resp: savedEssentialItems });
    } catch (error) {
        console.error("Error in postBulkEssential:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get essential information
exports.getEssential = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM EssentialInformation';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getEssential:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get essential information by ID
exports.getEssentialById = async (req, res) => {
    let connection;
    try {
        const essentialId = req.params.postId;
        connection = await client.getConnection();
        const query = 'SELECT * FROM EssentialInformation WHERE id = ?';
        const values = [essentialId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Essential Information not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getEssentialById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get essential information by package ID
exports.getEssentialByPackageId = async (req, res) => {
    let connection;
    try {
        const package_id = req.params.package_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM EssentialInformation WHERE package_id = ?';
        const values = [package_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getEssentialByPackageId:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update essential information by ID
exports.updateEssential = async (req, res) => {
    let connection;
    try {
        const essentialId = req.params.postId;
        const { package_id, title, description } = req.body;

        // Check if required fields are provided
        if (!package_id || !title || !description) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        connection = await client.getConnection();
        const query = `
            UPDATE EssentialInformation
            SET package_id = ?, title = ?, description = ?
            WHERE id = ?
            LIMIT 1`;
        const values = [package_id, title, description, essentialId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Essential Information not found.' });
        }

        res.status(200).json({ msg: 'Essential Information updated successfully.', resp: req.body });
    } catch (error) {
        console.error("Error in updateEssential:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete essential information by ID
exports.deleteEssential = async (req, res) => {
    let connection;
    try {
        const essentialId = req.params.postId;
        connection = await client.getConnection();
        const query = 'DELETE FROM EssentialInformation WHERE id = ?';
        const values = [essentialId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Essential Information not found.' });
        }

        res.status(200).json({ msg: 'Essential Information deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteEssential:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};