const mysql = require('../utils/db'); // Assuming this file contains the mysql connection setup

// Posting the category
exports.postCategory = async (req, res) => {
    try {
        const { category_name, language_id } = req.body;

        const query = 'INSERT INTO Categories (category_name, language_id) VALUES (?, ?)';
        const values = [category_name, language_id];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            if (result.affectedRows > 0) {
                res.status(201).json({ msg: 'Successfully Added Category.', category: { id: result.insertId, category_name, language_id } });
            } else {
                res.status(500).json({ msg: 'Failed to add category.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
}

// Get request for the category
exports.getCategory = async (req, res) => {
    try {
        const query = 'SELECT * FROM Categories';

        mysql.query(query, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
}

// Get request for category filtering by id
exports.getCategoryById = async (req, res) => {
    try {
        const query = 'SELECT * FROM Categories WHERE id = ?';
        const values = [req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            if (result.length > 0) {
                res.status(200).json(result[0]);
            } else {
                res.status(404).json({ msg: 'Category not found.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
}

// Get request for categories filtered by language
exports.getCategoryByLanguage = async (req, res) => {
    try {
        const query = 'SELECT * FROM Categories WHERE language_id = ?';
        const values = [req.params.language_id];

        mysql.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
}

// Update request for category
exports.updateCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        const query = 'UPDATE Categories SET category_name = ? WHERE id = ?';
        const values = [category_name, req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ msg: 'Category updated successfully.', category_name, language_id: req.body.language_id });
            } else {
                res.status(404).json({ msg: 'Category not found.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
}

// Delete request for category
exports.deleteCategory = async (req, res) => {
    try {
        const query = 'DELETE FROM Categories WHERE id = ?';
        const values = [req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ msg: 'Category deleted successfully.' });
            } else {
                res.status(404).json({ msg: 'Category not found.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
}
