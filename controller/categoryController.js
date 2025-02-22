const client = require('../utils/db');

// Posting the category
exports.postCategory = async (req, res) => {
    try {
        const { category_name, language_id } = req.body;
        
        const query = `
            INSERT INTO public."Categories" (category_name, language_id)
            VALUES ($1, $2) RETURNING *`;
        
        const values = [category_name, language_id];
        
        const newCategory = await client.query(query, values);
        
        if (newCategory.rowCount > 0) {
            res.status(201).json({ msg: 'Successfully Added Category.', category: newCategory.rows[0] });
        } else {
            res.status(500).json({ msg: 'Failed to add category.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
}

//get request for the category
exports.getCategory = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Categories"';
        const categories = await client.query(query);
        res.status(200).json(categories.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
}

//get request for category filtering by id
exports.getCategoryById = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Categories" WHERE id = $1';
        const values = [req.params.postId];
        const category = await client.query(query, values);
        
        if (category.rowCount > 0) {
            res.status(200).json(category.rows[0]);
        } else {
            res.status(404).json({ msg: 'Category not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
}

exports.getCategoryByLanguage = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Categories" WHERE language_id = $1';
        const values = [req.params.language_id];
        const categories = await client.query(query, values);
        res.status(200).json(categories.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
}

//update request for category 
exports.updateCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        const query = `
            UPDATE public."Categories"
            SET category_name = $1
            WHERE id = $2
            RETURNING *`;
        const values = [category_name, req.params.postId];
        const updatedCategory = await client.query(query, values);

        if (updatedCategory.rowCount > 0) {
            res.status(200).json(updatedCategory.rows[0]);
        } else {
            res.status(404).json({ msg: 'Category not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
}

//delete request for category
exports.deleteCategory = async (req, res) => {
    try {
        const query = 'DELETE FROM public."Categories" WHERE id = $1 RETURNING *';
        const values = [req.params.postId];
        const deletedCategory = await client.query(query, values);

        if (deletedCategory.rowCount > 0) {
            res.status(200).json(deletedCategory.rows[0]);
        } else {
            res.status(404).json({ msg: 'Category not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
}

