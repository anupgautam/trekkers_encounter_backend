const mysql = require('../utils/db'); // Assuming this file contains the MySQL connection setup

// Posting a single itinerary
exports.postItinerary = async (req, res) => {
    try {
        const { package_id, day, title, description } = req.body;

        const query = `
            INSERT INTO Itinerary (package_id, day, title, description)
            VALUES (?, ?, ?, ?)`;

        const values = [package_id, day, title, description];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            const newItinerary = { id: result.insertId, ...req.body };
            res.status(201).json({ msg: 'Package Itinerary Successfully Added.', resp: newItinerary });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

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
                INSERT INTO Itinerary (package_id, day, title, description)
                VALUES (?, ?, ?, ?)`;

            const values = [package_id, day, title, description];

            mysql.query(query, values, (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ msg: 'Server Error.', error: error.message });
                }
                savedItineraryItems.push({ id: result.insertId, ...item });
            });
        }

        res.status(201).json({ msg: 'Bulk Itinerary Items Successfully Added.', resp: savedItineraryItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Fetch all itineraries
exports.getItinerary = async (req, res) => {
    try {
        const query = 'SELECT * FROM Itinerary';

        mysql.query(query, (error, results) => {
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

// Fetch a single itinerary by ID
exports.getItineraryById = async (req, res) => {
    try {
        const itineraryId = req.params.postId;
        const query = 'SELECT * FROM Itinerary WHERE id = ?';
        const values = [itineraryId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ msg: 'Itinerary not found.' });
            }
            res.status(200).json(result[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Fetch itineraries by package ID
exports.getItineraryByPackage = async (req, res) => {
    try {
        const package_id = req.params.package_id;
        const query = 'SELECT * FROM Itinerary WHERE package_id = ?';
        const values = [package_id];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Update an itinerary by ID
exports.updateItinerary = async (req, res) => {
    try {
        const itineraryId = req.params.postId;
        const { package_id, day, title, description } = req.body;

        const query = `
            UPDATE Itinerary
            SET package_id = ?, day = ?, title = ?, description = ?
            WHERE id = ?
            LIMIT 1`;

        const values = [package_id, day, title, description, itineraryId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Itinerary not found.' });
            }
            res.status(200).json({ msg: 'Itinerary updated successfully.', resp: req.body });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Delete an itinerary by ID
exports.deleteItinerary = async (req, res) => {
    try {
        const itineraryId = req.params.postId;
        const query = 'DELETE FROM Itinerary WHERE id = ?';
        const values = [itineraryId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Itinerary not found.' });
            }
            res.status(200).json({ msg: 'Itinerary deleted successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};
