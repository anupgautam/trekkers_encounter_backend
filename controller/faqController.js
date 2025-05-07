const client = require('../utils/db');

// Posting the FAQ
exports.postFAQ = async (req, res) => {
    let connection;
    try {
        const { faq_question, faq_answer } = req.body;

        // Validate required fields
        if (!faq_question || !faq_answer) {
            return res.status(400).json({ msg: 'FAQ question and answer are required.' });
        }

        connection = await client.getConnection();
        const query = `INSERT INTO Faq (faq_question, faq_answer) VALUES (?, ?)`;
        const values = [faq_question, faq_answer];

        const [result] = await connection.query(query, values);
        const savedFaq = { id: result.insertId, faq_question, faq_answer };

        res.status(201).json({ msg: 'Faq Successfully Added.', resp: savedFaq });
    } catch (error) {
        console.error("Error in postFAQ:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get all FAQs
exports.getFAQ = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Faq';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getFAQ:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get FAQ by ID
exports.getFaqById = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Faq WHERE id = ?';
        const values = [req.params.postId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Faq not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getFaqById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update FAQ by ID
exports.updateFaq = async (req, res) => {
    let connection;
    try {
        const { faq_question, faq_answer } = req.body;

        // Validate required fields
        if (!faq_question || !faq_answer) {
            return res.status(400).json({ msg: 'FAQ question and answer are required.' });
        }

        connection = await client.getConnection();
        const query = 'UPDATE Faq SET faq_question = ?, faq_answer = ? WHERE id = ?';
        const values = [faq_question, faq_answer, req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Faq not found.' });
        }

        res.status(200).json({ msg: 'Faq updated successfully.', resp: { id: req.params.postId, faq_question, faq_answer } });
    } catch (error) {
        console.error("Error in updateFaq:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete FAQ by ID
exports.deleteFaq = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'DELETE FROM Faq WHERE id = ?';
        const values = [req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Faq not found.' });
        }

        res.status(200).json({ msg: 'Faq deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteFaq:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};