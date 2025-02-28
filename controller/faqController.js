const mysql = require('../utils/db'); // Import MySQL client (assuming mysql2 or mysql)


// Posting the FAQ
exports.postFAQ = async (req, res) => {
    try {
        const query = `INSERT INTO Faq (faq_question, faq_answer) VALUES (?, ?)`;

        const values = [req.body.faq_question, req.body.faq_answer];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            const savedFaq = { id: result.insertId, faq_question: req.body.faq_question, faq_answer: req.body.faq_answer };

            res.status(201).json({ msg: 'Faq Successfully Added.', resp: savedFaq });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get all FAQs
exports.getFAQ = async (req, res) => {
    try {
        const query = 'SELECT * FROM Faq';

        mysql.query(query, (error, result) => {
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
}

// Get FAQ by ID
exports.getFaqById = async (req, res) => {
    try {
        const query = 'SELECT * FROM Faq WHERE id = ?';
        const values = [req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ msg: 'Faq not found.' });
            }

            res.status(200).json(result[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Update FAQ by ID
exports.updateFaq = async (req, res) => {
    try {
        const query = 'UPDATE Faq SET faq_question = ?, faq_answer = ? WHERE id = ?';
        const values = [req.body.faq_question, req.body.faq_answer, req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Faq not found.' });
            }

            res.status(200).json({ msg: 'Faq updated successfully.', resp: { id: req.params.postId, faq_question: req.body.faq_question, faq_answer: req.body.faq_answer } });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Delete FAQ by ID
exports.deleteFaq = async (req, res) => {
    try {
        const query = 'DELETE FROM Faq WHERE id = ?';
        const values = [req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Faq not found.' });
            }

            res.status(200).json({ msg: 'Faq deleted successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}
