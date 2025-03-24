const mysql = require('../utils/db'); // Import your MySQL client

// Posting the include/exclude package
exports.postIncludeExcludePackage = async (req, res) => {
    try {
        const { package_id, include_exclude_id } = req.body;

        // Check if required fields are provided
        if (!package_id || !include_exclude_id) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        const query = 'INSERT INTO IncludeExcludePackage (package_id, include_exclude_id) VALUES (?, ?)';
        const values = [package_id, include_exclude_id];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            const savedIncludeExcludePackage = { id: result.insertId, package_id, include_exclude_id };

            res.status(201).json({ msg: 'Include/Exclude Package Successfully Added.', resp: savedIncludeExcludePackage });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Posting the include/exclude bulk package
exports.postBulkIncludeExcludePackage = async (req, res) => {
    try {
        const { includeItems } = req.body;

        // Check if includeItems is an array
        if (!Array.isArray(includeItems)) {
            return res.status(400).json({ msg: 'includeItems should be an array.' });
        }

        const savedIncludeExcludeItems = [];

        for (const item of includeItems) {
            const { package_id, include_exclude_id } = item;

            // Check if required fields are provided
            if (!package_id || !include_exclude_id) {
                return res.status(400).json({ msg: 'Missing required fields.' });
            }

            const query = 'INSERT INTO IncludeExcludePackage (package_id, include_exclude_id) VALUES (?, ?)';
            const values = [package_id, include_exclude_id];

            mysql.query(query, values, (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ msg: 'Server Error.', error: error.message });
                }

                const savedItem = { id: result.insertId, package_id, include_exclude_id };
                savedIncludeExcludeItems.push(savedItem);
            });
        }

        res.status(201).json({ msg: 'Bulk Include/Exclude Items Successfully Added.', resp: savedIncludeExcludeItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get the Include/Exclude Package
exports.getIncludeExcludePackage = async (req, res) => {
    try {
        const query = 'SELECT * FROM IncludeExcludePackage';

        mysql.query(query, (error, result) => {
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
}

// Get Include/Exclude Package by ID
exports.getIncludeExcludePackageById = async (req, res) => {
    try {
        const { postId } = req.params;
        const query = 'SELECT * FROM IncludeExcludePackage WHERE id = ?';
        const values = [postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ msg: 'Include/Exclude Package not found.' });
            }

            res.status(200).json(result[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get Include/Exclude Package by Package ID

exports.getIncludeExcludePackageByPackage = async (req, res) => {
    try {
        const package_id = req.params.package_id;

        // Query to fetch IncludeExcludePackage records for the given package_id
        const query = 'SELECT * FROM IncludeExcludePackage WHERE package_id = ?';
        const values = [package_id];

        // Helper function to wrap mysql.query into a Promise
        const queryAsync = (query, values) => {
            return new Promise((resolve, reject) => {
                mysql.query(query, values, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        // Fetching the IncludeExcludePackage data
        const result = await queryAsync(query, values);

        if (result.length === 0) {
            return res.status(404).json({ msg: 'Include/Exclude Packages not found for the specified package.' });
        }

        // Combining the IncludeExcludePackage data with related IncludeExclude data
        const combinedData = await Promise.all(result.map(async (data) => {
            // Fetch the related IncludeExclude data
            const query = 'SELECT * FROM IncludeExclude WHERE id = ?';
            const values = [data.include_exclude_id];

            // Fetch the IncludeExclude data
            const singleData = await queryAsync(query, values);

            if (singleData.length === 0) {
                return { 
                    id: data.id,
                    package_id: data.package_id,
                    include_exclude_id: null,  // If no related data found, set null
                };
            }

            return {
                id: data.id,
                package_id: data.package_id,
                include_exclude_id: singleData[0], // Including the first (and only) result from IncludeExclude
            };
        }));

        res.status(200).json(combinedData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Bulk update
exports.updateIncludeExcludePackageId = async (req, res) => {
    try {
        const { includeItems } = req.body;

        // Check if includeItems is an array
        if (!Array.isArray(includeItems)) {
            return res.status(400).json({ msg: 'includeItems should be an array.' });
        }

        const updatedIncludeExcludeItems = [];
        const { package_id } = includeItems[0];

        // Fetch existing include_exclude items for the package_id
        const existingItemsQuery = 'SELECT include_exclude_id FROM IncludeExcludePackage WHERE package_id = ?';
        mysql.query(existingItemsQuery, [package_id], (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            const existingItems = result.map(row => row.include_exclude_id);

            // Identify items to delete and insert/update
            const itemsToDelete = existingItems.filter(item => !includeItems.some(selectedItem => selectedItem.include_exclude_id === item));
            const itemsToInsertOrUpdate = includeItems.filter(selectedItem => !existingItems.includes(selectedItem.include_exclude_id));

            // Delete items that were removed in the multi-select
            for (const itemToDelete of itemsToDelete) {
                const deleteQuery = 'DELETE FROM IncludeExcludePackage WHERE package_id = ? AND include_exclude_id = ?';
                mysql.query(deleteQuery, [package_id, itemToDelete], (error) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ msg: 'Server Error.', error: error.message });
                    }
                });
            }

            // Insert or update newly selected items
            for (const itemToInsertOrUpdate of itemsToInsertOrUpdate) {
                const { include_exclude_id } = itemToInsertOrUpdate;
                const upsertQuery = `
                    INSERT INTO IncludeExcludePackage (package_id, include_exclude_id)
                    VALUES (?, ?)
                    ON DUPLICATE KEY UPDATE package_id = ?, include_exclude_id = ?`;

                mysql.query(upsertQuery, [package_id, include_exclude_id, package_id, include_exclude_id], (error, result) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ msg: 'Server Error.', error: error.message });
                    }

                    updatedIncludeExcludeItems.push({ id: result.insertId, package_id, include_exclude_id });
                });
            }

            res.status(200).json({ msg: 'Bulk Include/Exclude Items Successfully Updated.', updatedItems: updatedIncludeExcludeItems });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Update Include/Exclude Package by ID
exports.updateIncludeExcludePackage = async (req, res) => {
    try {
        const { postId } = req.params;
        const { package_id, include_exclude_id } = req.body;

        const query = 'UPDATE IncludeExcludePackage SET package_id = ?, include_exclude_id = ? WHERE id = ?';
        const values = [package_id, include_exclude_id, postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Include/Exclude Package not found.' });
            }

            res.status(200).json({ msg: 'Include/Exclude Package updated successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Delete Include/Exclude Package by ID
exports.deleteIncludeExcludePackage = async (req, res) => {
    try {
        const { postId } = req.params;
        const query = 'DELETE FROM IncludeExcludePackage WHERE id = ?';
        const values = [postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Include/Exclude Package not found.' });
            }

            res.status(200).json({ msg: 'Include/Exclude Package deleted successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};
