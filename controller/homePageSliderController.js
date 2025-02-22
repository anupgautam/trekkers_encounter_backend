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
            INSERT INTO public."HomePageSlider" (title, description, slider_image, language_id)
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        const values = [title, description, slider_image, language_id];

        const savedHomePageSlider = await client.query(query, values);

        res.status(201).json({ msg: 'Successfully Added Home page slider.', data: savedHomePageSlider.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Get request for the Home page slider
exports.getHomePageSlider = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."HomePageSlider"';
        const result = await client.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get request for Home page slider filtering by id
exports.getHomePageSliderById = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."HomePageSlider" WHERE id = $1';
        const values = [req.params.postId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Home page slider not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get request for Home page slider using language_id
exports.getHomePageSliderByLanguage = async (req, res) => {
    try {
        const language_id = req.params.language_id;
        const query = 'SELECT * FROM public."HomePageSlider" WHERE language_id = $1';
        const values = [language_id];

        const result = await client.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

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
            UPDATE public."HomePageSlider" 
            SET title = $1, description = $2, slider_image = $3, language_id = $4
            WHERE id = $5
            RETURNING *
        `;
        const values = [title, description, slider_image, language_id, req.params.postId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Home page slider not found.' });
        }

        res.status(200).json({ msg: 'Home page slider updated successfully.', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Delete request for Home page slider
exports.deleteHomePageSlider = async (req, res) => {
    try {
        const query = 'DELETE FROM public."HomePageSlider" WHERE id = $1 RETURNING *';
        const values = [req.params.postId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Home page slider not found.' });
        }

        res.status(200).json({ msg: 'Home page slider deleted successfully.', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}
