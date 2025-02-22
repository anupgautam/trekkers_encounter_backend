const client = require('../utils/db'); // Import your PostgreSQL client

// Posting the Faq
exports.postFAQ = async (req, res) => {
    try {
        const query = `INSERT INTO public."Faq" (faq_question, faq_answer) VALUES ($1, $2) RETURNING *`;
        const values = [req.body.faq_question, req.body.faq_answer];

        const savedFaq = await client.query(query, values);

        res.status(201).json({ msg: 'Faq Successfully Added.', resp: savedFaq.rows[0] });
    } catch (error) {
        console.error(error); // Log any unexpected errors
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get the Faq
exports.getFAQ = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Faq"';
        const result = await client.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get request for Faq filtering by id
exports.getFaqById = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Faq" WHERE id = $1';
        const values = [req.params.postId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Faq not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Update the Faq using id
exports.updateFaq = async (req, res) => {
    try {
        const query = 'UPDATE public."Faq" SET faq_question = $1, faq_answer = $2 WHERE id = $3 RETURNING *';
        const values = [req.body.faq_question, req.body.faq_answer, req.params.postId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Faq not found.' });
        }

        res.status(200).json({ msg: 'Faq updated successfully.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Delete request for Faq
exports.deleteFaq = async (req, res) => {
    try {
        const query = 'DELETE FROM public."Faq" WHERE id = $1 RETURNING *';
        const values = [req.params.postId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Faq not found.' });
        }

        res.status(200).json({ msg: 'Faq deleted successfully.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}
