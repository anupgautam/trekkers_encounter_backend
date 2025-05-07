const client = require('../utils/db');

// Posting the FAQ package
exports.postFaqPackage = async (req, res) => {
    let connection;
    try {
        const { package_id, faq_id } = req.body;

        // Validate required fields
        if (!package_id || !faq_id) {
            return res.status(400).json({ msg: 'Package ID and FAQ ID are required.' });
        }

        connection = await client.getConnection();
        const query = `INSERT INTO FaqPackage (package_id, faq_id) VALUES (?, ?)`;
        const values = [package_id, faq_id];

        const [result] = await connection.query(query, values);
        const savedFaqPackage = { id: result.insertId, package_id, faq_id };

        res.status(201).json({ msg: 'Faq Package Successfully Added.', resp: savedFaqPackage });
    } catch (error) {
        console.error("Error in postFaqPackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Bulk posting FAQ packages
exports.postBulkFaqPackage = async (req, res) => {
    let connection;
    try {
        const { faqPackageItems } = req.body;

        if (!Array.isArray(faqPackageItems)) {
            return res.status(400).json({ msg: 'faqPackageItems should be an array.' });
        }

        if (faqPackageItems.length === 0) {
            return res.status(400).json({ msg: 'No FAQ package items provided.' });
        }

        connection = await client.getConnection();
        const savedFaqPackages = [];

        const insertPromises = faqPackageItems.map(async (item) => {
            const { package_id, faq_id } = item;

            if (!package_id || !faq_id) {
                throw new Error('Missing required fields in faqPackageItem.');
            }

            const query = `INSERT INTO FaqPackage (package_id, faq_id) VALUES (?, ?)`;
            const values = [package_id, faq_id];

            const [result] = await connection.query(query, values);
            return { id: result.insertId, package_id, faq_id };
        });

        const results = await Promise.all(insertPromises);
        savedFaqPackages.push(...results);

        res.status(201).json({ msg: 'Bulk FaqPackages Successfully Added.', resp: savedFaqPackages });
    } catch (error) {
        console.error("Error in postBulkFaqPackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get all FAQ packages
exports.getFaqPackage = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM FaqPackage';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getFaqPackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get FAQ package by ID
exports.getFaqPackageById = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM FaqPackage WHERE id = ?';
        const values = [req.params.postId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Faq Package not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getFaqPackageById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get FAQ packages by package ID
exports.getFaqByPackage = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM FaqPackage WHERE package_id = ?';
        const values = [req.params.package_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getFaqByPackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Bulk update FAQ packages
exports.updateFaqPackageId = async (req, res) => {
    let connection;
    try {
        const { faqPackageItems } = req.body;

        if (!Array.isArray(faqPackageItems)) {
            return res.status(400).json({ msg: 'faqPackageItems should be an array.' });
        }

        if (faqPackageItems.length === 0) {
            return res.status(200).json({ msg: 'No items to update.', updatedFaqPackages: [] });
        }

        connection = await client.getConnection();
        const { package_id } = faqPackageItems[0];

        // Get existing FAQ IDs for the package
        const [existingFaqIdsResult] = await connection.query('SELECT faq_id FROM FaqPackage WHERE package_id = ?', [package_id]);
        const existingFaqIds = existingFaqIdsResult.map(row => row.faq_id);

        // Determine items to delete and insert/update
        const faqIdsToDelete = existingFaqIds.filter(faqId => !faqPackageItems.some(item => item.faq_id === faqId));
        const faqIdsToInsertOrUpdate = faqPackageItems.filter(item => !existingFaqIds.includes(item.faq_id));

        // Perform deletions
        const deletePromises = faqIdsToDelete.map(async (faqIdToDelete) => {
            const [deleteResult] = await connection.query('DELETE FROM FaqPackage WHERE package_id = ? AND faq_id = ?', [package_id, faqIdToDelete]);
            return deleteResult;
        });

        // Perform inserts/updates
        const upsertPromises = faqIdsToInsertOrUpdate.map(async (item) => {
            const { faq_id } = item;
            const [upsertResult] = await connection.query(
                'INSERT INTO FaqPackage (package_id, faq_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE package_id = ?, faq_id = ?',
                [package_id, faq_id, package_id, faq_id]
            );
            return { package_id, faq_id };
        });

        await Promise.all([...deletePromises, ...upsertPromises]);
        const updatedFaqPackages = faqPackageItems.map(item => ({ package_id, faq_id: item.faq_id }));

        res.status(200).json({ msg: 'Bulk FaqPackages Successfully Updated.', updatedFaqPackages });
    } catch (error) {
        console.error("Error in updateFaqPackageId:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update FAQ package by ID
exports.updateFaqPackage = async (req, res) => {
    let connection;
    try {
        const { package_id, faq_id } = req.body;

        // Validate required fields
        if (!package_id || !faq_id) {
            return res.status(400).json({ msg: 'Package ID and FAQ ID are required.' });
        }

        connection = await client.getConnection();
        const query = 'UPDATE FaqPackage SET package_id = ?, faq_id = ? WHERE id = ?';
        const values = [package_id, faq_id, req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Faq Package not found.' });
        }

        res.status(200).json({ msg: 'Faq Package updated successfully.', resp: { package_id, faq_id } });
    } catch (error) {
        console.error("Error in updateFaqPackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete FAQ package by ID
exports.deleteFaqPackage = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'DELETE FROM FaqPackage WHERE id = ?';
        const values = [req.params.postId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Data does not exist.' });
        }

        res.status(200).json({ msg: 'Faq Package deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteFaqPackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};