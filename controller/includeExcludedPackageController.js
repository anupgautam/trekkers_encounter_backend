const client = require('../utils/db');

// Posting the Include/Exclude Package
exports.postIncludeExcludePackage = async (req, res) => {
    let connection;
    try {
        const { package_id, include_exclude_id } = req.body;

        // Check if required fields are provided
        if (!package_id || !include_exclude_id) {
            return res.status(400).json({ msg: 'Missing required fields: package_id and include_exclude_id are required.' });
        }

        connection = await client.getConnection();
        const query = 'INSERT INTO IncludeExcludePackage (package_id, include_exclude_id) VALUES (?, ?)';
        const values = [package_id, include_exclude_id];

        const [result] = await connection.query(query, values);
        const savedIncludeExcludePackage = { id: result.insertId, package_id, include_exclude_id };

        res.status(201).json({ msg: 'Include/Exclude Package Successfully Added.', resp: savedIncludeExcludePackage });
    } catch (error) {
        console.error("Error in postIncludeExcludePackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Posting the Include/Exclude Bulk Package
exports.postBulkIncludeExcludePackage = async (req, res) => {
    let connection;
    try {
        const { includeItems } = req.body;

        // Check if includeItems is an array
        if (!Array.isArray(includeItems)) {
            return res.status(400).json({ msg: 'includeItems should be an array.' });
        }

        if (includeItems.length === 0) {
            return res.status(400).json({ msg: 'No Include/Exclude items provided.' });
        }

        connection = await client.getConnection();
        const savedIncludeExcludeItems = [];

        const insertPromises = includeItems.map(async (item) => {
            const { package_id, include_exclude_id } = item;

            // Check if required fields are provided
            if (!package_id || !include_exclude_id) {
                throw new Error('Missing required fields in one or more items.');
            }

            const query = 'INSERT INTO IncludeExcludePackage (package_id, include_exclude_id) VALUES (?, ?)';
            const values = [package_id, include_exclude_id];

            const [result] = await connection.query(query, values);
            return { id: result.insertId, package_id, include_exclude_id };
        });

        const results = await Promise.all(insertPromises);
        savedIncludeExcludeItems.push(...results);

        res.status(201).json({ msg: 'Bulk Include/Exclude Items Successfully Added.', resp: savedIncludeExcludeItems });
    } catch (error) {
        console.error("Error in postBulkIncludeExcludePackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get the Include/Exclude Package
exports.getIncludeExcludePackage = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM IncludeExcludePackage';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getIncludeExcludePackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get Include/Exclude Package by ID
exports.getIncludeExcludePackageById = async (req, res) => {
    let connection;
    try {
        const { postId } = req.params;
        connection = await client.getConnection();
        const query = 'SELECT * FROM IncludeExcludePackage WHERE id = ?';
        const values = [postId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Include/Exclude Package not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getIncludeExcludePackageById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get Include/Exclude Package by Package ID
exports.getIncludeExcludePackageByPackage = async (req, res) => {
    let connection;
    try {
        const package_id = req.params.package_id;
        connection = await client.getConnection();

        // Fetch IncludeExcludePackage records for the given package_id
        const query = 'SELECT * FROM IncludeExcludePackage WHERE package_id = ?';
        const values = [package_id];

        const [result] = await connection.query(query, values);

        if (result.length === 0) {
            return res.status(404).json({ msg: 'Include/Exclude Packages not found for the specified package.' });
        }

        // Fetch related IncludeExclude data for each IncludeExcludePackage record
        const combinedData = await Promise.all(result.map(async (data) => {
            const query = 'SELECT * FROM IncludeExclude WHERE id = ?';
            const values = [data.include_exclude_id];

            const [singleData] = await connection.query(query, values);

            if (singleData.length === 0) {
                return {
                    id: data.id,
                    package_id: data.package_id,
                    include_exclude_id: null,
                };
            }

            return {
                id: data.id,
                package_id: data.package_id,
                include_exclude_id: singleData[0],
            };
        }));

        res.status(200).json(combinedData);
    } catch (error) {
        console.error("Error in getIncludeExcludePackageByPackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Bulk update Include/Exclude Package
exports.updateIncludeExcludePackageId = async (req, res) => {
    let connection;
    try {
        const { includeItems } = req.body;

        // Check if includeItems is an array
        if (!Array.isArray(includeItems)) {
            return res.status(400).json({ msg: 'includeItems should be an array.' });
        }

        if (includeItems.length === 0) {
            return res.status(200).json({ msg: 'No items to update.', updatedItems: [] });
        }

        connection = await client.getConnection();
        const { package_id } = includeItems[0];

        // Fetch existing include_exclude items for the package_id
        const [existingItemsResult] = await connection.query('SELECT include_exclude_id FROM IncludeExcludePackage WHERE package_id = ?', [package_id]);
        const existingItems = existingItemsResult.map(row => row.include_exclude_id);

        // Identify items to delete and insert/update
        const itemsToDelete = existingItems.filter(item => !includeItems.some(selectedItem => selectedItem.include_exclude_id === item));
        const itemsToInsertOrUpdate = includeItems.filter(selectedItem => !existingItems.includes(selectedItem.include_exclude_id));

        // Perform deletions
        const deletePromises = itemsToDelete.map(async (itemToDelete) => {
            const [deleteResult] = await connection.query('DELETE FROM IncludeExcludePackage WHERE package_id = ? AND include_exclude_id = ?', [package_id, itemToDelete]);
            return deleteResult;
        });

        // Perform inserts/updates
        const upsertPromises = itemsToInsertOrUpdate.map(async (item) => {
            const { include_exclude_id } = item;
            const [upsertResult] = await connection.query(
                'INSERT INTO IncludeExcludePackage (package_id, include_exclude_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE package_id = ?, include_exclude_id = ?',
                [package_id, include_exclude_id, package_id, include_exclude_id]
            );
            return { id: upsertResult.insertId, package_id, include_exclude_id };
        });

        const upsertResults = await Promise.all([...deletePromises, ...upsertPromises]);
        const updatedIncludeExcludeItems = upsertResults.filter(result => result.id).map(result => ({
            id: result.id,
            package_id: result.package_id,
            include_exclude_id: result.include_exclude_id
        }));

        res.status(200).json({ msg: 'Bulk Include/Exclude Items Successfully Updated.', updatedItems: updatedIncludeExcludeItems });
    } catch (error) {
        console.error("Error in updateIncludeExcludePackageId:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update Include/Exclude Package by ID
exports.updateIncludeExcludePackage = async (req, res) => {
    let connection;
    try {
        const { postId } = req.params;
        const { package_id, include_exclude_id } = req.body;

        // Check if required fields are provided
        if (!package_id || !include_exclude_id) {
            return res.status(400).json({ msg: 'Missing required fields: package_id and include_exclude_id are required.' });
        }

        connection = await client.getConnection();
        const query = 'UPDATE IncludeExcludePackage SET package_id = ?, include_exclude_id = ? WHERE id = ?';
        const values = [package_id, include_exclude_id, postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Include/Exclude Package not found.' });
        }

        res.status(200).json({ msg: 'Include/Exclude Package updated successfully.', resp: { id: postId, package_id, include_exclude_id } });
    } catch (error) {
        console.error("Error in updateIncludeExcludePackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete Include/Exclude Package by ID
exports.deleteIncludeExcludePackage = async (req, res) => {
    let connection;
    try {
        const { postId } = req.params;
        connection = await client.getConnection();
        const query = 'DELETE FROM IncludeExcludePackage WHERE id = ?';
        const values = [postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Include/Exclude Package not found.' });
        }

        res.status(200).json({ msg: 'Include/Exclude Package deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteIncludeExcludePackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};