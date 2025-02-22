const client = require('../utils/db'); 

// Posting Sub-Category
exports.postSubCategory = async (req, res) => {
    try {
        const { category_id, language_id, sub_category_name } = req.body;
        const query = `
            INSERT INTO public."Subcategory" (category_id, language_id, sub_category_name)
            VALUES ($1, $2, $3) RETURNING *`;
        const values = [category_id, language_id, sub_category_name];

        const result = await client.query(query, values);

        res.status(201).json({ msg: 'Sub Category Successfully Added.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get all Sub-Categories
exports.getSubCategory = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Subcategory"';
        const results = await client.query(query);

        res.status(200).json(results.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get Sub-Category by ID
exports.getSubCategoryById = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Subcategory" WHERE id = $1';
        const values = [req.params.postId];

        const result = await client.query(query, values);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get Sub-Categories by Language
exports.getSubCategoryByLanguage = async (req, res) => {
    try {
        const language_id = req.params.language_id;
        const query = 'SELECT * FROM public."Subcategory" WHERE language_id = $1';
        const values = [language_id];

        const results = await client.query(query, values);

        res.status(200).json(results.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get Sub-Categories by Category
exports.getSubCategoryByCategory = async (req, res) => {
    try {
        const category_id = req.params.category_id;
        const query = 'SELECT * FROM public."Subcategory" WHERE category_id = $1';
        const values = [category_id];

        const results = await client.query(query, values);

        res.status(200).json(results.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Update Sub-Category
exports.updateSubCategory = async (req, res) => {
    try {
        const { category_id, language_id, sub_category_name } = req.body;
        const query = `
            UPDATE public."Subcategory"
            SET category_id = $1, language_id = $2, sub_category_name = $3
            WHERE id = $4
            RETURNING *`;
        const values = [category_id, language_id, sub_category_name, req.params.postId];

        const result = await client.query(query, values);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Delete Sub-Category
exports.deleteSubCategory = async (req, res) => {
    try {
        const query = 'DELETE FROM public."Subcategory" WHERE id = $1 RETURNING *';
        const values = [req.params.postId];

        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            res.status(404).json({ msg: "Data does not exist." });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};
