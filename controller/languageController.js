const client = require('../utils/db');

// Posting the language
exports.postLanguage = async (req, res) => {
    try {
        const { language } = req.body;
        const query = 'INSERT INTO public."Languages" (language) VALUES ($1) RETURNING *';
        const values = [language];
        const result = await client.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error });
    }
}

//get request for the language
exports.getLanguage = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Languages"';
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error });
    }
}

//get request for language filtering by id
exports.getLanguageById = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Languages" WHERE id = $1';
        const values = [req.params.id];
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Language not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error });
    }
}

//update request for language 
exports.updateLanguage = async (req, res) => {
    try {
        const { language } = req.body;
        const query = 'UPDATE public."Languages" SET language = $1 WHERE id = $2 RETURNING *';
        const values = [language, req.params.id];
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Language not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error });
    }
}

//delete request for language
exports.deleteLanguage = async (req, res) => {
    try {
        const query = 'DELETE FROM public."Languages" WHERE id = $1 RETURNING *';
        const values = [req.params.id];
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Language not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error });
    }
}

