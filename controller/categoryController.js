const client = require("../utils/db");

// Posting the category
exports.postCategory = async (req, res) => {
    let connection;
    try {
        const { category_name, language_id } = req.body;

        if (!category_name || !language_id) {
            return res.status(400).json({ msg: 'Category name and language ID are required.' });
        }

        connection = await client.getConnection();
        const query = 'INSERT INTO Categories (category_name, language_id) VALUES (?, ?)';
        const values = [category_name, language_id];

        const [result] = await connection.query(query, values);
        res.status(201).json({
            msg: 'Successfully Added Category.',
            category: { id: result.insertId, category_name, language_id },
        });
    } catch (error) {
        console.error("Error in postCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for the category
exports.getCategory = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Categories';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for category filtering by id
exports.getCategoryById = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Categories WHERE id = ?';
        const values = [req.params.postId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Category not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getCategoryById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for categories filtered by language
exports.getCategoryByLanguage = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Categories WHERE language_id = ?';
        const values = [req.params.language_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getCategoryByLanguage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update request for category
exports.updateCategory = async (req, res) => {
    let connection;
    try {
        const { category_name, language_id } = req.body;

        if (!category_name) {
            return res.status(400).json({ msg: 'Category name is required.' });
        }

        connection = await client.getConnection();
        const query = 'UPDATE Categories SET category_name = ?, language_id = COALESCE(?, language_id) WHERE id = ?';
        const values = [category_name, language_id || null, req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Category not found.' });
        }

        res.status(200).json({ msg: 'Category updated successfully.', category_name, language_id });
    } catch (error) {
        console.error("Error in updateCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete request for category
exports.deleteCategory = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'DELETE FROM Categories WHERE id = ?';
        const values = [req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Category not found.' });
        }

        res.status(200).json({ msg: 'Category deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};