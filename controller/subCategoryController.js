const client = require('../utils/db');

// Posting Sub-Category
exports.postSubCategory = async (req, res) => {
    let connection;
    try {
        const { category_id, language_id, sub_category_name } = req.body;

        // Validate required fields
        if (!category_id || !language_id || !sub_category_name) {
            return res.status(400).json({ msg: 'Missing required fields: category_id, language_id, and sub_category_name are required.' });
        }

        connection = await client.getConnection();

        // Check if category exists
        const [categoryResult] = await connection.query('SELECT id FROM Category WHERE id = ?', [category_id]);
        if (categoryResult.length === 0) {
            return res.status(404).json({ msg: 'Category not found.' });
        }

        // Check if language exists
        const [languageResult] = await connection.query('SELECT id FROM Languages WHERE id = ?', [language_id]);
        if (languageResult.length === 0) {
            return res.status(404).json({ msg: 'Language not found.' });
        }

        const query = 'INSERT INTO Subcategory (category_id, language_id, sub_category_name) VALUES (?, ?, ?)';
        const values = [category_id, language_id, sub_category_name];

        const [result] = await connection.query(query, values);
        const newSubCategory = { id: result.insertId, category_id, language_id, sub_category_name };

        res.status(201).json({ msg: 'Sub-Category Successfully Added.', resp: newSubCategory });
    } catch (error) {
        console.error("Error in postSubCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get all Sub-Categories
exports.getSubCategory = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Subcategory';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getSubCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get Sub-Category by ID
exports.getSubCategoryById = async (req, res) => {
    let connection;
    try {
        const subCategoryId = req.params.postId;
        connection = await client.getConnection();
        const query = 'SELECT * FROM Subcategory WHERE id = ?';
        const values = [subCategoryId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Sub-Category not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getSubCategoryById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get Sub-Categories by Language
exports.getSubCategoryByLanguage = async (req, res) => {
    let connection;
    try {
        const language_id = req.params.language_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM Subcategory WHERE language_id = ?';
        const values = [language_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getSubCategoryByLanguage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get Sub-Categories by Category
exports.getSubCategoryByCategory = async (req, res) => {
    let connection;
    try {
        const category_id = req.params.category_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM Subcategory WHERE category_id = ?';
        const values = [category_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getSubCategoryByCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update Sub-Category
exports.updateSubCategory = async (req, res) => {
    let connection;
    try {
        const subCategoryId = req.params.postId;
        const { category_id, language_id, sub_category_name } = req.body;

        // Validate required fields
        if (!category_id || !language_id || !sub_category_name) {
            return res.status(400).json({ msg: 'Missing required fields: category_id, language_id, and sub_category_name are required.' });
        }

        connection = await client.getConnection();

        // Check if category exists
        const [categoryResult] = await connection.query('SELECT id FROM Category WHERE id = ?', [category_id]);
        if (categoryResult.length === 0) {
            return res.status(404).json({ msg: 'Category not found.' });
        }

        // Check if language exists
        const [languageResult] = await connection.query('SELECT id FROM Languages WHERE id = ?', [language_id]);
        if (languageResult.length === 0) {
            return res.status(404).json({ msg: 'Language not found.' });
        }

        const query = 'UPDATE Subcategory SET category_id = ?, language_id = ?, sub_category_name = ? WHERE id = ?';
        const values = [category_id, language_id, sub_category_name, subCategoryId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Sub-Category not found.' });
        }

        res.status(200).json({ msg: 'Sub-Category updated successfully.', resp: { id: subCategoryId, category_id, language_id, sub_category_name } });
    } catch (error) {
        console.error("Error in updateSubCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete Sub-Category
exports.deleteSubCategory = async (req, res) => {
    let connection;
    try {
        const subCategoryId = req.params.postId;
        connection = await client.getConnection();
        const query = 'DELETE FROM Subcategory WHERE id = ?';
        const values = [subCategoryId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Sub-Category not found.' });
        }

        res.status(200).json({ msg: 'Sub-Category deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteSubCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};