const client = require('../utils/db'); // Import your PostgreSQL client

// Posting the IncludeExclude
exports.postIncludeExclude = async (req, res) => {
    try {
        const query = `INSERT INTO public."IncludeExclude" (title, type) VALUES ($1, $2) RETURNING *`;
        const values = [req.body.title, req.body.type];

        const savedIncludeExclude = await client.query(query, values);

        res.status(201).json({ msg: 'Include Exclude Successfully Added.', resp: savedIncludeExclude.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get the IncludeExclude
exports.getIncludeExclude = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."IncludeExclude"';
        const result = await client.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get request for IncludeExclude filtering by id
exports.getIncludeExcludeById = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."IncludeExclude" WHERE id = $1';
        const values = [req.params.postId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Include Exclude not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Update the IncludeExclude using id
exports.updateIncludeExclude = async (req, res) => {
    try {
        const query = 'UPDATE public."IncludeExclude" SET title = $1, type = $2 WHERE id = $3 RETURNING *';
        const values = [req.body.title, req.body.type, req.params.postId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Include Exclude not found.' });
        }

        res.status(200).json({ msg: 'Include Exclude updated successfully.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Delete request for IncludeExclude
exports.deleteIncludeExclude = async (req, res) => {
    try {
        const query = 'DELETE FROM public."IncludeExclude" WHERE id = $1 RETURNING *';
        const values = [req.params.postId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Include Exclude not found.' });
        }

        res.status(200).json({ msg: 'Include Exclude deleted successfully.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}
