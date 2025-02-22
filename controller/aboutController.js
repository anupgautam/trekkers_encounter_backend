const client = require('../utils/db'); // Import your PostgreSQL client

// Posting the About
exports.postAbout = async (req, res) => {
    try {
        const { title, short_description, description, language_id } = req.body;

        const query = `INSERT INTO public."About" (title, short_description, description, language_id) VALUES ($1, $2, $3, $4)`;
        const values = [title, short_description, description, language_id];

        await client.query(query, values);
        
        // You may want to retrieve the inserted record, but it depends on your needs
        // You can use a SELECT query if needed
        
        res.status(201).json({ msg: 'Successfully Added About.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get the About
exports.getAbout = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."About"';
        const result = await client.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get request for About filtering by id
exports.getAboutById = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."About" WHERE id = $1';
        const values = [req.params.postId];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'About not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

exports.getAboutByLanguage = async (req, res) => {
    try {
        const language_id = req.params.language_id;
        const query = 'SELECT * FROM public."About" WHERE language_id = $1';
        const values = [language_id];
        const result = await client.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Update request for About
exports.updateAbout = async (req, res) => {
    try {
        const { title, short_description, description, language_id } = req.body;
        const query = 'UPDATE public."About" SET title = $1, short_description = $2, description = $3, language_id = $4 WHERE id = $5';
        const values = [title, short_description, description, language_id, req.params.postId];
        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'About not found.' });
        }

        res.status(200).json({ msg: 'About updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Delete request for About
exports.deleteAbout = async (req, res) => {
    try {
        const query = 'DELETE FROM public."About" WHERE id = $1';
        const values = [req.params.postId];
        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'About not found.' });
        }

        res.status(200).json({ msg: 'About deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}
