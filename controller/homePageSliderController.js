const client = require('../utils/db');
const baseUrl = 'https://api.trekkersencounter.com';

// Posting the Home page slider
exports.postHomePageSlider = async (req, res) => {
    let connection;
    try {
        const { title, description, language_id } = req.body;
        const slider_image = req.file ? `${baseUrl}/${req.file.path}` : null;

        // Check if required fields are provided
        if (!title || !description || !language_id || !slider_image) {
            return res.status(400).json({ msg: 'Missing required fields: title, description, language_id, and slider_image are required.' });
        }

        connection = await client.getConnection();
        const query = `
            INSERT INTO HomePageSlider (title, description, slider_image, language_id)
            VALUES (?, ?, ?, ?)
        `;
        const values = [title, description, slider_image, language_id];

        const [result] = await connection.query(query, values);
        const savedSlider = { id: result.insertId, title, description, slider_image, language_id };

        res.status(201).json({ msg: 'Successfully Added Home page slider.', data: savedSlider });
    } catch (error) {
        console.error("Error in postHomePageSlider:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for the Home page slider
exports.getHomePageSlider = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM HomePageSlider';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getHomePageSlider:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for Home page slider filtering by id
exports.getHomePageSliderById = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM HomePageSlider WHERE id = ?';
        const values = [req.params.postId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Home page slider not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getHomePageSliderById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for Home page slider using language_id
exports.getHomePageSliderByLanguage = async (req, res) => {
    let connection;
    try {
        const language_id = req.params.language_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM HomePageSlider WHERE language_id = ?';
        const values = [language_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getHomePageSliderByLanguage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update request for Home page slider
exports.updateHomePageSlider = async (req, res) => {
    let connection;
    try {
        const { title, description, language_id } = req.body;
        const slider_image = req.file ? `${baseUrl}/${req.file.path}` : req.body.slider_image;

        // Check if required fields are provided
        if (!title || !description || !language_id) {
            return res.status(400).json({ msg: 'Missing required fields: title, description, and language_id are required.' });
        }

        connection = await client.getConnection();
        const query = `
            UPDATE HomePageSlider
            SET title = ?, description = ?, slider_image = COALESCE(?, slider_image), language_id = ?
            WHERE id = ?
        `;
        const values = [title, description, slider_image || null, language_id, req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Home page slider not found.' });
        }

        const updatedSlider = { id: req.params.postId, title, description, slider_image, language_id };
        res.status(200).json({ msg: 'Home page slider updated successfully.', data: updatedSlider });
    } catch (error) {
        console.error("Error in updateHomePageSlider:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete request for Home page slider
exports.deleteHomePageSlider = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'DELETE FROM HomePageSlider WHERE id = ?';
        const values = [req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Home page slider not found.' });
        }

        res.status(200).json({ msg: 'Home page slider deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteHomePageSlider:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};