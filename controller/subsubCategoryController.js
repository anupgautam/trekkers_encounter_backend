const mysql = require('../utils/db'); // Assuming this file contains the mysql connection setup

// Posting Sub-Category
exports.postSubSubCategory = async (req, res) => {
    try {
        const { category_id, language_id, sub_sub_category_name, sub_category_id } = req.body;

        // Make sure to provide 4 placeholders in the query
        const query = 'INSERT INTO Subsubcategory (category_id, language_id, sub_category_id, sub_sub_category_name) VALUES (?, ?, ?, ?)';

        // The values array must match the number of placeholders
        const values = [category_id, language_id, sub_category_id, sub_sub_category_name];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            if (result.affectedRows > 0) {
                res.status(201).json({ msg: 'Sub Category Successfully Added.', resp: { id: result.insertId, category_id, language_id, sub_sub_category_name, sub_category_id } });
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
exports.getSubSubCategory = async (req, res) => {
    try {
        const query = 'SELECT * FROM Subsubcategory';

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
exports.getSubSubCategoryById = async (req, res) => {
    try {
        const query = 'SELECT * FROM Subsubcategory WHERE id = ?';
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
exports.getSubSubCategoryByLanguage = async (req, res) => {
    try {
        const language_id = req.params.language_id;
        const query = 'SELECT * FROM Subsubcategory WHERE language_id = ?';
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
exports.getSubSubCategoryByCategory = async (req, res) => {
    try {
        const sub_category_id = req.params.sub_category_id;
        const query = 'SELECT * FROM Subsubcategory WHERE sub_category_id = ?';
        const values = [sub_category_id];

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

// Get Sub-Categories by  sub Category
exports.getSubCategoryByCategory = async (req, res) => {
    try {
        const category_id = req.params.sub_category_name_id;
        const query = 'SELECT * FROM Subsubcategory WHERE sub_category_name_id = ?';
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
exports.updateSubSubCategory = async (req, res) => {
    try {
        const { category_id, language_id, sub_sub_category_name, sub_category_id } = req.body;

        const query = 'UPDATE Subsubcategory SET category_id = ?, language_id = ?, sub_category_id = ?, sub_sub_category_name = ? WHERE id = ?';

        const values = [category_id, language_id, sub_category_id, sub_sub_category_name, req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ msg: 'Sub-Category updated successfully.', category_id, language_id, sub_sub_category_name, sub_category_id });
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
exports.deleteSubSubCategory = async (req, res) => {
    try {
        const query = 'DELETE FROM Subsubcategory WHERE id = ?';
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
