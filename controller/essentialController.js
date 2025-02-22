const client = require('../utils/db'); 

// Posting essential information
exports.postEssential = async (req, res) => {
    try {
        const { package_id, title, description } = req.body;

        // Check if required fields are provided
        if (!package_id || !title || !description) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        const query = `
            INSERT INTO public."EssentialInformation" (package_id, title, description)
            VALUES ($1, $2, $3)
            RETURNING *`;

        const values = [package_id, title, description];

        const result = await client.query(query, values);

        res.status(201).json({ msg: 'Essential Information Successfully Added.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Bulk posting essential information
exports.postBulkEssential = async (req, res) => {
    try {
        const { package_id, essentialItems } = req.body;

        // Check if essentialItems is an array
        if (!Array.isArray(essentialItems)) {
            return res.status(400).json({ msg: 'essentialItems should be an array.' });
        }

        const savedEssentialItems = [];

        for (const item of essentialItems) {
            const { title, description } = item;

            // Check if required fields are provided for each item
            if (!title || !description) {
                return res.status(400).json({ msg: 'Missing required fields in one or more items.' });
            }

            const query = `
                INSERT INTO public."EssentialInformation" (package_id, title, description)
                VALUES ($1, $2, $3)
                RETURNING *`;

            const values = [package_id, title, description];

            const result = await client.query(query, values);
            savedEssentialItems.push(result.rows[0]);
        }

        res.status(201).json({ msg: 'Bulk Essential Information Successfully Added.', resp: savedEssentialItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get essential information
exports.getEssential = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."EssentialInformation"';
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get essential information by ID
exports.getEssentialById = async (req, res) => {
    try {
        const essentialId = req.params.postId;
        const query = 'SELECT * FROM public."EssentialInformation" WHERE id = $1';
        const values = [essentialId];
        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Essential Information not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get essential information by package ID
exports.getEssentialByPackageId = async (req, res) => {
    try {
        const package_id = req.params.package_id;
        const query = 'SELECT * FROM public."EssentialInformation" WHERE package_id = $1';
        const values = [package_id];
        const result = await client.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Update essential information by ID
exports.updateEssential = async (req, res) => {
    try {
        const essentialId = req.params.postId;
        const { package_id, title, description } = req.body;

        // Check if required fields are provided
        if (!package_id || !title || !description) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        const query = `
            UPDATE public."EssentialInformation"
            SET package_id = $1, title = $2, description = $3
            WHERE id = $4
            RETURNING *`;

        const values = [package_id, title, description, essentialId];

        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Essential Information not found.' });
        }

        res.status(200).json({ msg: 'Essential Information updated successfully.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Delete essential information by ID
exports.deleteEssential = async (req, res) => {
    try {
        const essentialId = req.params.postId;
        const query = 'DELETE FROM public."EssentialInformation" WHERE id = $1';
        const values = [essentialId];
        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Essential Information not found.' });
        }

        res.status(200).json({ msg: 'Essential Information deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}
