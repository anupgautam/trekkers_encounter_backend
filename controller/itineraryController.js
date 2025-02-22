const client = require('../utils/db'); // Import your PostgreSQL client

// Posting a single itinerary
exports.postItinerary = async (req, res) => {
    try {
        const { package_id, day, title, description } = req.body;

        const query = `
            INSERT INTO public."Itinerary" (package_id, day, title, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;

        const values = [package_id, day, title, description];

        const result = await client.query(query, values);

        res.status(201).json({ msg: 'Package Itinerary Successfully Added.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Posting multiple itineraries in bulk
exports.postBulkItinerary = async (req, res) => {
    try {
        const { package_id, itineraryItems } = req.body;

        if (!Array.isArray(itineraryItems)) {
            return res.status(400).json({ msg: 'itineraryItems should be an array.' });
        }

        const savedItineraryItems = [];

        for (const item of itineraryItems) {
            const { day, title, description } = item;

            const query = `
                INSERT INTO public."Itinerary" (package_id, day, title, description)
                VALUES ($1, $2, $3, $4)
                RETURNING *`;

            const values = [package_id, day, title, description];

            const result = await client.query(query, values);

            savedItineraryItems.push(result.rows[0]);
        }

        res.status(201).json({ msg: 'Bulk Itinerary Items Successfully Added.', resp: savedItineraryItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Fetch all itineraries
exports.getItinerary = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Itinerary"';
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Fetch a single itinerary by ID
exports.getItineraryById = async (req, res) => {
    try {
        const itineraryId = req.params.postId;
        const query = 'SELECT * FROM public."Itinerary" WHERE _id = $1';
        const values = [itineraryId];
        const result = await client.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Fetch itineraries by package ID
exports.getItineraryByPackage = async (req, res) => {
    try {
        const package_id = req.params.package_id;
        const query = 'SELECT * FROM public."Itinerary" WHERE package_id = $1';
        const values = [package_id];
        const result = await client.query(query, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Update an itinerary by ID
exports.updateItinerary = async (req, res) => {
    try {
        const itineraryId = req.params.postId;
        const { package_id, day, title, description } = req.body;

        const query = `
            UPDATE public."Itinerary"
            SET package_id = $1, day = $2, title = $3, description = $4
            WHERE _id = $5
            RETURNING *`;

        const values = [package_id, day, title, description, itineraryId];

        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Package not found.' });
        }

        res.status(200).json({ msg: 'Package updated successfully.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Delete an itinerary by ID
exports.deleteItinerary = async (req, res) => {
    try {
        const itineraryId = req.params.postId;
        const query = 'DELETE FROM public."Itinerary" WHERE _id = $1';
        const values = [itineraryId];
        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Itinerary not found.' });
        }

        res.status(200).json({ msg: 'Itinerary deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}
