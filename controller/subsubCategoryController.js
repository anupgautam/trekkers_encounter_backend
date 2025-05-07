const client = require('../utils/db');

// Posting Sub-Sub-Category
exports.postSubSubCategory = async (req, res) => {
    let connection;
    try {
        const { category_id, language_id, sub_sub_category_name, sub_category_id } = req.body;

        // Validate required fields
        if (!category_id || !language_id || !sub_category_id || !sub_sub_category_name) {
            return res.status(400).json({ msg: 'Missing required fields: category_id, language_id, sub_category_id, and sub_sub_category_name are required.' });
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

        // Check if sub-category exists
        const [subCategoryResult] = await connection.query('SELECT id FROM Subcategory WHERE id = ?', [sub_category_id]);
        if (subCategoryResult.length === 0) {
            return res.status(404).json({ msg: 'Sub-Category not found.' });
        }

        const query = 'INSERT INTO Subsubcategory (category_id, language_id, sub_category_id, sub_sub_category_name) VALUES (?, ?, ?, ?)';
        const values = [category_id, language_id, sub_category_id, sub_sub_category_name];

        const [result] = await connection.query(query, values);
        const newSubSubCategory = { id: result.insertId, category_id, language_id, sub_category_id, sub_sub_category_name };

        res.status(201).json({ msg: 'Sub-Sub-Category Successfully Added.', resp: newSubSubCategory });
    } catch (error) {
        console.error("Error in postSubSubCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get all Sub-Sub-Categories
exports.getSubSubCategory = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Subsubcategory';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getSubSubCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get Sub-Sub-Category by ID
exports.getSubSubCategoryById = async (req, res) => {
    let connection;
    try {
        const subSubCategoryId = req.params.postId;
        connection = await client.getConnection();
        const query = 'SELECT * FROM Subsubcategory WHERE id = ?';
        const values = [subSubCategoryId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Sub-Sub-Category not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getSubSubCategoryById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get Sub-Sub-Categories by Language
exports.getSubSubCategoryByLanguage = async (req, res) => {
    let connection;
    try {
        const language_id = req.params.language_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM Subsubcategory WHERE language_id = ?';
        const values = [language_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getSubSubCategoryByLanguage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get Sub-Sub-Categories by Category
exports.getSubSubCategoryByCategory = async (req, res) => {
    let connection;
    try {
        const category_id = req.params.category_id; // Corrected from sub_category_name_id
        connection = await client.getConnection();
        const query = 'SELECT * FROM Subsubcategory WHERE category_id = ?';
        const values = [category_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getSubSubCategoryByCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get Sub-Sub-Categories by Sub-Category
exports.getSubSubCategoryBySubCategory = async (req, res) => {
    let connection;
    try {
        const sub_category_id = req.params.sub_category_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM Subsubcategory WHERE sub_category_id = ?';
        const values = [sub_category_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getSubSubCategoryBySubCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update Sub-Sub-Category
exports.updateSubSubCategory = async (req, res) => {
    let connection;
    try {
        const subSubCategoryId = req.params.postId;
        const { category_id, language_id, sub_sub_category_name, sub_category_id } = req.body;

        // Validate required fields
        if (!category_id || !language_id || !sub_category_id || !sub_sub_category_name) {
            return res.status(400).json({ msg: 'Missing required fields: category_id, language_id, sub_category_id, and sub_sub_category_name are required.' });
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

        // Check if sub-category exists
        const [subCategoryResult] = await connection.query('SELECT id FROM Subcategory WHERE id = ?', [sub_category_id]);
        if (subCategoryResult.length === 0) {
            return res.status(404).json({ msg: 'Sub-Category not found.' });
        }

        const query = 'UPDATE Subsubcategory SET category_id = ?, language_id = ?, sub_category_id = ?, sub_sub_category_name = ? WHERE id = ?';
        const values = [category_id, language_id, sub_category_id, sub_sub_category_name, subSubCategoryId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Sub-Sub-Category not found.' });
        }

        res.status(200).json({ msg: 'Sub-Sub-Category updated successfully.', resp: { id: subSubCategoryId, category_id, language_id, sub_category_id, sub_sub_category_name } });
    } catch (error) {
        console.error("Error in updateSubSubCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete Sub-Sub-Category
exports.deleteSubSubCategory = async (req, res) => {
    let connection;
    try {
        const subSubCategoryId = req.params.postId;
        connection = await client.getConnection();
        const query = 'DELETE FROM Subsubcategory WHERE id = ?';
        const values = [subSubCategoryId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Sub-Sub-Category not found.' });
        }

        res.status(200).json({ msg: 'Sub-Sub-Category deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteSubSubCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};