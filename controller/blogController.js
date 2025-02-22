const client = require("../utils/db");
const baseUrl = 'http://localhost:8888';



// Posting the blog
exports.postBlog = async (req, res) => {
    try {
        const { title, short_description, description } = req.body;
        const image = `${baseUrl}/${req.file.path}`;
        const query = `
            INSERT INTO public."Blog" (title, short_description, image, description)
            VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [title, short_description, image, description];

        const result = await client.query(query, values);

        res.status(201).json({ msg: 'Successfully Added Blog.', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

//get request for the blog
exports.getBlog = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Blog"';
        const result = await client.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

//get request for blog filtering by id
exports.getBlogById = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Blog" WHERE id = $1';
        const values = [req.params.postId];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Blog not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


//update request for blog
exports.updateBlog = async (req, res) => {
    try {
        const { title, short_description, description } = req.body;
        const image = req.file ? `${baseUrl}/${req.file.path}` : null;
        const blogId = req.params.postId;

        const query = `
            UPDATE public."Blog"
            SET title = $1, short_description = $2, description = $3, image = COALESCE($4, image), updated_at = NOW()
            WHERE id = $5
            RETURNING *`;

        const values = [title, short_description, description, image, blogId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Blog not found.' });
        }

        res.status(200).json({ msg: 'Blog updated successfully.', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


//delete request for blog
exports.deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.postId;
        const query = `
            DELETE FROM public."Blog"
            WHERE id = $1
            RETURNING *`;
        const values = [blogId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Blog not found.' });
        }

        res.status(200).json({ msg: 'Blog deleted successfully.', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


