const client = require('../utils/db'); // Import your PostgreSQL client
const baseUrl = 'http://localhost:8888';

// Posting the Home page slider
exports.postHomePageSlider = async (req, res) => {
    try {
        const { title, description, language_id } = req.body;
        const slider_image = `${baseUrl}/${req.file.path}`;

        // Check if required fields are provided
        if (!title || !description || !language_id || !slider_image) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        const query = `
            INSERT INTO HomePageSlider (title, description, slider_image, language_id)
            VALUES (?, ?, ?, ?)
        `;
        const values = [title, description, slider_image, language_id];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            res.status(201).json({ msg: 'Successfully Added Home page slider.', data: results[0] });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Get request for the Home page slider
exports.getHomePageSlider = async (req, res) => {
    try {
        const query = 'SELECT * FROM HomePageSlider';

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


// Get request for Home page slider filtering by id
exports.getHomePageSliderById = async (req, res) => {
    try {
        const query = 'SELECT * FROM HomePageSlider WHERE id = ?';
        const values = [req.params.postId];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ msg: 'Home page slider not found.' });
            }

            res.status(200).json(results[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Get request for Home page slider using language_id
exports.getHomePageSliderByLanguage = async (req, res) => {
    try {
        const language_id = req.params.language_id;
        const query = 'SELECT * FROM HomePageSlider WHERE language_id = ?';
        const values = [language_id];

        client.query(query, values, (error, results) => {
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


// Update request for Home page slider
exports.updateHomePageSlider = async (req, res) => {
    try {
        const { title, description, language_id } = req.body;
        let slider_image = req.body.slider_image;

        // Check if req.file exists and has a path property
        if (req.file && req.file.path) {
            slider_image = `${baseUrl}/${req.file.path}`;
        }

        const query = `
            UPDATE HomePageSlider
            SET title = ?, description = ?, slider_image = ?, language_id = ?
            WHERE id = ?
        `;
        const values = [title, description, slider_image, language_id, req.params.postId];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: 'Home page slider not found.' });
            }

            res.status(200).json({ msg: 'Home page slider updated successfully.', data: results });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Delete request for Home page slider
exports.deleteHomePageSlider = async (req, res) => {
    try {
        const query = 'DELETE FROM HomePageSlider WHERE id = ?';
        const values = [req.params.postId];

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: 'Home page slider not found.' });
            }

            res.status(200).json({ msg: 'Home page slider deleted successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

