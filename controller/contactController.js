const client = require('../utils/db'); // Import your PostgreSQL client

// Posting the Contact Us
exports.postContact = async (req, res) => {
    try {
        const { full_name, email, contact_no, address, message } = req.body;

        // Check if required fields are provided
        if (!full_name || !email || !contact_no || !address || !message) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        const query = `INSERT INTO ContactUs (full_name, email, contact_no, address, message) VALUES (?, ?, ?, ?, ?)`;
        const values = [full_name, email, contact_no, address, message];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            res.status(201).json({ msg: 'Contact Us Successfully Added.', resp: results.insertId });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Get the Contact Us
exports.getContact = async (req, res) => {
    try {
        const query = 'SELECT * FROM ContactUs';

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


// Get request for Contact Us filtering by id
exports.getContactById = async (req, res) => {
    try {
        const query = 'SELECT * FROM ContactUs WHERE id = ?';
        const values = [req.params.postId];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ msg: 'Contact Us not found.' });
            }

            res.status(200).json(results[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Update the Contact Us using id
exports.updateContact = async (req, res) => {
    try {
        const { full_name, email, contact_no, address, message } = req.body;
        const query = 'UPDATE ContactUs SET full_name = ?, email = ?, contact_no = ?, address = ?, message = ? WHERE id = ?';
        const values = [full_name, email, contact_no, address, message, req.params.postId];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: 'Contact Us not found.' });
            }

            res.status(200).json({ msg: 'Contact Us updated successfully.', resp: results });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Delete request for Contact Us
exports.deleteContact = async (req, res) => {
    try {
        const query = 'DELETE FROM ContactUs WHERE id = ?';
        const values = [req.params.postId];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: 'Contact Us not found.' });
            }

            res.status(200).json({ msg: 'Contact Us deleted successfully.', resp: results });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

