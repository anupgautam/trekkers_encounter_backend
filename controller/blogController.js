const client = require("../utils/db");
const baseUrl = 'https://api.trekkersencounter.com';

// Posting the blog
exports.postBlog = async (req, res) => {
    let connection;
    try {
        const { title, short_description, description } = req.body;
        const image = req.file ? `${baseUrl}/${req.file.path}` : null;

        if (!title || !short_description || !description) {
            return res.status(400).json({ msg: 'Title, short description, and description are required.' });
        }

        connection = await client.getConnection();
        const query = `
            INSERT INTO Blog (title, short_description, image, description)
            VALUES (?, ?, ?, ?)`;
        const values = [title, short_description, image, description];

        const [result] = await connection.query(query, values);
        res.status(201).json({ msg: 'Successfully Added Blog.', data: result.insertId });
    } catch (error) {
        console.error("Error in postBlog:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for the blog
exports.getBlog = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Blog';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getBlog:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for blog filtering by id
exports.getBlogById = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Blog WHERE id = ?';
        const values = [req.params.postId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Blog not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getBlogById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update request for blog
exports.updateBlog = async (req, res) => {
    let connection;
    try {
        const { title, short_description, description } = req.body;
        const image = req.file ? `${baseUrl}/${req.file.path}` : null;
        const blogId = req.params.postId;

        if (!title || !short_description || !description) {
            return res.status(400).json({ msg: 'Title, short description, and description are required.' });
        }

        connection = await client.getConnection();
        const query = `
            UPDATE Blog
            SET title = ?, short_description = ?, description = ?, image = COALESCE(?, image), updated_at = NOW()
            WHERE id = ?`;
        const values = [title, short_description, description, image, blogId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Blog not found.' });
        }

        res.status(200).json({ msg: 'Blog updated successfully.', data: result });
    } catch (error) {
        console.error("Error in updateBlog:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete request for blog
exports.deleteBlog = async (req, res) => {
    let connection;
    try {
        const blogId = req.params.postId;
        connection = await client.getConnection();
        const query = 'DELETE FROM Blog WHERE id = ?';
        const values = [blogId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Blog not found.' });
        }

        res.status(200).json({ msg: 'Blog deleted successfully.', data: result });
    } catch (error) {
        console.error("Error in deleteBlog:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};