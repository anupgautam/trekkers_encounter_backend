const client = require('../utils/db'); // Import your PostgreSQL client

// Posting the Contact Us
exports.postContact = async (req, res) => {
    try {
        const { full_name, email, contact_no, address, message } = req.body;

        // Check if required fields are provided
        if (!full_name || !email || !contact_no || !address || !message) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        const query = `INSERT INTO public."ContactUs" (full_name, email, contact_no, address, message) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [full_name, email, contact_no, address, message];

        const savedContact = await client.query(query, values);

        res.status(201).json({ msg: 'Contact Us Successfully Added.', resp: savedContact.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get the Contact Us
exports.getContact = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."ContactUs"';
        const result = await client.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get request for Contact Us filtering by id
exports.getContactById = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."ContactUs" WHERE id = $1';
        const values = [req.params.postId];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Contact Us not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Update the Contact Us using id
exports.updateContact = async (req, res) => {
    try {
        const { full_name, email, contact_no, address, message } = req.body;
        const query = 'UPDATE public."ContactUs" SET full_name = $1, email = $2, contact_no = $3, address = $4, message = $5 WHERE id = $6 RETURNING *';
        const values = [full_name, email, contact_no, address, message, req.params.postId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Contact Us not found.' });
        }

        res.status(200).json({ msg: 'Contact Us updated successfully.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Delete request for Contact Us
exports.deleteContact = async (req, res) => {
    try {
        const query = 'DELETE FROM public."ContactUs" WHERE id = $1 RETURNING *';
        const values = [req.params.postId];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Contact Us not found.' });
        }

        res.status(200).json({ msg: 'Contact Us deleted successfully.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}
