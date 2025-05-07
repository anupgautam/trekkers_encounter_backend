const client = require('../utils/db');

// Posting the Contact Us
exports.postContact = async (req, res) => {
    let connection;
    try {
        const { full_name, email, contact_no, address, message } = req.body;

        // Check if required fields are provided
        if (!full_name || !email || !contact_no || !address || !message) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        connection = await client.getConnection();
        const query = `INSERT INTO ContactUs (full_name, email, contact_no, address, message) VALUES (?, ?, ?, ?, ?)`;
        const values = [full_name, email, contact_no, address, message];

        const [result] = await connection.query(query, values);
        res.status(201).json({ msg: 'Contact Us Successfully Added.', resp: result.insertId });
    } catch (error) {
        console.error("Error in postContact:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get the Contact Us
exports.getContact = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM ContactUs';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getContact:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for Contact Us filtering by id
exports.getContactById = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM ContactUs WHERE id = ?';
        const values = [req.params.postId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Contact Us not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getContactById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update the Contact Us using id
exports.updateContact = async (req, res) => {
    let connection;
    try {
        const { full_name, email, contact_no, address, message } = req.body;
        connection = await client.getConnection();
        const query = 'UPDATE ContactUs SET full_name = ?, email = ?, contact_no = ?, address = ?, message = ? WHERE id = ?';
        const values = [full_name, email, contact_no, address, message, req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Contact Us not found.' });
        }

        res.status(200).json({ msg: 'Contact Us updated successfully.', resp: result });
    } catch (error) {
        console.error("Error in updateContact:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete request for Contact Us
exports.deleteContact = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'DELETE FROM ContactUs WHERE id = ?';
        const values = [req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Contact Us not found.' });
        }

        res.status(200).json({ msg: 'Contact Us deleted successfully.', resp: result });
    } catch (error) {
        console.error("Error in deleteContact:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};