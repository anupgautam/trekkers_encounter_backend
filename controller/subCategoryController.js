const mysql = require('../utils/db'); // Assuming this file contains the mysql connection setup

// Posting Sub-Category
exports.postSubCategory = async (req, res) => {
    try {
        const { category_id, language_id, sub_category_name } = req.body;
        const query = 'INSERT INTO Subcategory (category_id, language_id, sub_category_name) VALUES (?, ?, ?)';
        const values = [category_id, language_id, sub_category_name];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            if (result.affectedRows > 0) {
                res.status(201).json({ msg: 'Sub Category Successfully Added.', resp: { id: result.insertId, category_id, language_id, sub_category_name } });
            } else {
                res.status(500).json({ msg: 'Failed to add Sub-Category.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get all Sub-Categories
exports.getSubCategory = async (req, res) => {
    try {
        const query = 'SELECT * FROM Subcategory';

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
};

// Get Sub-Category by ID
exports.getSubCategoryById = async (req, res) => {
    try {
        const query = 'SELECT * FROM Subcategory WHERE id = ?';
        const values = [req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            if (result.length > 0) {
                res.status(200).json(result[0]);
            } else {
                res.status(404).json({ msg: 'Sub-Category not found.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get Sub-Categories by Language
exports.getSubCategoryByLanguage = async (req, res) => {
    try {
        const language_id = req.params.language_id;
        const query = 'SELECT * FROM Subcategory WHERE language_id = ?';
        const values = [language_id];

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
};

// Get Sub-Categories by Category
exports.getSubCategoryByCategory = async (req, res) => {
    try {
        const category_id = req.params.category_id;
        const query = 'SELECT * FROM Subcategory WHERE category_id = ?';
        const values = [category_id];

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
};

// Update Sub-Category
exports.updateSubCategory = async (req, res) => {
    try {
        const { category_id, language_id, sub_category_name } = req.body;
        const query = 'UPDATE Subcategory SET category_id = ?, language_id = ?, sub_category_name = ? WHERE id = ?';
        const values = [category_id, language_id, sub_category_name, req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ msg: 'Sub-Category updated successfully.', category_id, language_id, sub_category_name });
            } else {
                res.status(404).json({ msg: 'Sub-Category not found.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Delete Sub-Category
exports.deleteSubCategory = async (req, res) => {
    try {
        const query = 'DELETE FROM Subcategory WHERE id = ?';
        const values = [req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ msg: 'Sub-Category deleted successfully.' });
            } else {
                res.status(404).json({ msg: 'Sub-Category not found.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};
