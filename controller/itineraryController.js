const client = require('../utils/db');

// Posting a single itinerary
exports.postItinerary = async (req, res) => {
    let connection;
    try {
        const { package_id, day, title, description } = req.body;

        // Check if required fields are provided
        if (!package_id || !day || !title || !description) {
            return res.status(400).json({ msg: 'Missing required fields: package_id, day, title, and description are required.' });
        }

        connection = await client.getConnection();
        const query = `
            INSERT INTO Itinerary (package_id, day, title, description)
            VALUES (?, ?, ?, ?)`;
        const values = [package_id, day, title, description];

        const [result] = await connection.query(query, values);
        const newItinerary = { id: result.insertId, package_id, day, title, description };

        res.status(201).json({ msg: 'Package Itinerary Successfully Added.', resp: newItinerary });
    } catch (error) {
        console.error("Error in postItinerary:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Posting multiple itineraries in bulk
exports.postBulkItinerary = async (req, res) => {
    let connection;
    try {
        const { package_id, itineraryItems } = req.body;

        // Check if itineraryItems is an array
        if (!Array.isArray(itineraryItems)) {
            return res.status(400).json({ msg: 'itineraryItems should be an array.' });
        }

        if (!package_id) {
            return res.status(400).json({ msg: 'Package ID is required.' });
        }

        if (itineraryItems.length === 0) {
            return res.status(400).json({ msg: 'No itinerary items provided.' });
        }

        connection = await client.getConnection();
        const savedItineraryItems = [];

        const insertPromises = itineraryItems.map(async (item) => {
            const { day, title, description } = item;

            // Check if required fields are provided for each item
            if (!day || !title || !description) {
                throw new Error('Missing required fields in one or more itinerary items.');
            }

            const query = `
                INSERT INTO Itinerary (package_id, day, title, description)
                VALUES (?, ?, ?, ?)`;
            const values = [package_id, day, title, description];

            const [result] = await connection.query(query, values);
            return { id: result.insertId, day, title, description };
        });

        const results = await Promise.all(insertPromises);
        savedItineraryItems.push(...results);

        res.status(201).json({ msg: 'Bulk Itinerary Items Successfully Added.', resp: savedItineraryItems });
    } catch (error) {
        console.error("Error in postBulkItinerary:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Fetch all itineraries
exports.getItinerary = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Itinerary';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getItinerary:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Fetch a single itinerary by ID
exports.getItineraryById = async (req, res) => {
    let connection;
    try {
        const itineraryId = req.params.postId;
        connection = await client.getConnection();
        const query = 'SELECT * FROM Itinerary WHERE id = ?';
        const values = [itineraryId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Itinerary not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getItineraryById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Fetch itineraries by package ID
exports.getItineraryByPackage = async (req, res) => {
    let connection;
    try {
        const package_id = req.params.package_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM Itinerary WHERE package_id = ?';
        const values = [package_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getItineraryByPackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update an itinerary by ID
exports.updateItinerary = async (req, res) => {
    let connection;
    try {
        const itineraryId = req.params.postId;
        const { package_id, day, title, description } = req.body;

        // Check if required fields are provided
        if (!package_id || !day || !title || !description) {
            return res.status(400).json({ msg: 'Missing required fields: package_id, day, title, and description are required.' });
        }

        connection = await client.getConnection();
        const query = `
            UPDATE Itinerary
            SET package_id = ?, day = ?, title = ?, description = ?
            WHERE id = ?
            LIMIT 1`;
        const values = [package_id, day, title, description, itineraryId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Itinerary not found.' });
        }

        res.status(200).json({ msg: 'Itinerary updated successfully.', resp: { id: itineraryId, package_id, day, title, description } });
    } catch (error) {
        console.error("Error in updateItinerary:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete an itinerary by ID
exports.deleteItinerary = async (req, res) => {
    let connection;
    try {
        const itineraryId = req.params.postId;
        connection = await client.getConnection();
        const query = 'DELETE FROM Itinerary WHERE id = ?';
        const values = [itineraryId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Itinerary not found.' });
        }

        res.status(200).json({ msg: 'Itinerary deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteItinerary:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};