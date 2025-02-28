const client = require("../utils/db");
const baseUrl = 'http://localhost:8888';



// Posting the blog
exports.postBlog = async (req, res) => {
    try {
        const { title, short_description, description } = req.body;
        const image = `${baseUrl}/${req.file.path}`;

        const query = `
            INSERT INTO Blog (title, short_description, image, description)
            VALUES (?, ?, ?, ?)`;
        const values = [title, short_description, image, description];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            res.status(201).json({ msg: 'Successfully Added Blog.', data: results.insertId });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Get request for the blog
exports.getBlog = async (req, res) => {
    try {
        const query = 'SELECT * FROM Blog';

        client.query(query, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Get request for blog filtering by id
exports.getBlogById = async (req, res) => {
    try {
        const query = 'SELECT * FROM Blog WHERE id = ?';
        const values = [req.params.postId];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ msg: 'Blog not found.' });
            }

            res.status(200).json(results[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};



// Update request for blog
exports.updateBlog = async (req, res) => {
    try {
        const { title, short_description, description } = req.body;
        const image = req.file ? `${baseUrl}/${req.file.path}` : null;
        const blogId = req.params.postId;

        const query = `
            UPDATE Blog
            SET title = ?, short_description = ?, description = ?, image = COALESCE(?, image), updated_at = NOW()
            WHERE id = ?`;
        const values = [title, short_description, description, image, blogId];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: 'Blog not found.' });
            }

            res.status(200).json({ msg: 'Blog updated successfully.', data: results });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};



// Delete request for blog
exports.deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.postId;
        const query = 'DELETE FROM Blog WHERE id = ?';
        const values = [blogId];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: 'Blog not found.' });
            }

            res.status(200).json({ msg: 'Blog deleted successfully.', data: results });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};



