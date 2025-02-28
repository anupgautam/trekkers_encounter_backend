const mysql = require('../utils/db'); // Import MySQL client

// Posting the FAQ package
exports.postFaqPackage = async (req, res) => {
    try {
        const { package_id, faq_id } = req.body;
        const query = `INSERT INTO FaqPackage (package_id, faq_id) VALUES (?, ?)`;

        const values = [package_id, faq_id];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            const savedFaqPackage = { id: result.insertId, package_id, faq_id };

            res.status(201).json({ msg: 'Faq Package Successfully Added.', resp: savedFaqPackage });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Bulk posting FAQ packages
exports.postBulkFaqPackage = async (req, res) => {
    try {
        const { faqPackageItems } = req.body;

        if (!Array.isArray(faqPackageItems)) {
            return res.status(400).json({ msg: 'faqPackageItems should be an array.' });
        }

        const savedFaqPackages = [];

        for (const item of faqPackageItems) {
            const { package_id, faq_id } = item;

            if (!package_id || !faq_id) {
                return res.status(400).json({ msg: 'Missing required fields in faqPackageItem.' });
            }

            const query = `INSERT INTO FaqPackage (package_id, faq_id) VALUES (?, ?)`;

            const values = [package_id, faq_id];

            mysql.query(query, values, (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ msg: 'Server Error.', error });
                }

                savedFaqPackages.push({ id: result.insertId, package_id, faq_id });

                if (savedFaqPackages.length === faqPackageItems.length) {
                    res.status(201).json({ msg: 'Bulk FaqPackages Successfully Added.', resp: savedFaqPackages });
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get all FAQ packages
exports.getFaqPackage = async (req, res) => {
    try {
        const query = 'SELECT * FROM FaqPackage';
        mysql.query(query, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get FAQ package by ID
exports.getFaqPackageById = async (req, res) => {
    try {
        const query = 'SELECT * FROM FaqPackage WHERE id = ?';
        const values = [req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }

            if (result.length === 0) {
                return res.status(404).json({ msg: 'Faq Package not found.' });
            }

            res.status(200).json(result[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get FAQ packages by package ID
exports.getFaqByPackage = async (req, res) => {
    try {
        const query = 'SELECT * FROM FaqPackage WHERE package_id = ?';
        const values = [req.params.package_id];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Bulk update FAQ packages
exports.updateFaqPackageId = async (req, res) => {
    try {
        const { faqPackageItems } = req.body;

        if (!Array.isArray(faqPackageItems)) {
            return res.status(400).json({ msg: 'faqPackageItems should be an array.' });
        }

        const updatedFaqPackages = [];
        const { package_id } = faqPackageItems[0];

        const existingFaqIdsQuery = 'SELECT faq_id FROM FaqPackage WHERE package_id = ?';
        mysql.query(existingFaqIdsQuery, [package_id], (error, existingFaqIdsResult) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }

            const existingFaqIds = existingFaqIdsResult.map(row => row.faq_id);

            const faqIdsToDelete = existingFaqIds.filter(faqId => !faqPackageItems.some(selectedItem => selectedItem.faq_id === faqId));
            const faqIdsToInsertOrUpdate = faqPackageItems.filter(selectedItem => !existingFaqIds.includes(selectedItem.faq_id));

            for (const faqIdToDelete of faqIdsToDelete) {
                const deleteQuery = 'DELETE FROM FaqPackage WHERE package_id = ? AND faq_id = ?';
                mysql.query(deleteQuery, [package_id, faqIdToDelete], (error, result) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ msg: 'Server Error.', error });
                    }
                });
            }

            for (const faqItemToInsertOrUpdate of faqIdsToInsertOrUpdate) {
                const { faq_id } = faqItemToInsertOrUpdate;
                const upsertQuery = 'INSERT INTO FaqPackage (package_id, faq_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE package_id = ?, faq_id = ?';
                mysql.query(upsertQuery, [package_id, faq_id, package_id, faq_id], (error, result) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ msg: 'Server Error.', error });
                    }

                    updatedFaqPackages.push({ package_id, faq_id });
                });
            }

            res.status(200).json({ msg: 'Bulk FaqPackages Successfully Updated.', updatedFaqPackages });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Update FAQ package by ID
exports.updateFaqPackage = async (req, res) => {
    try {
        const { package_id, faq_id } = req.body;
        const query = 'UPDATE FaqPackage SET package_id = ?, faq_id = ? WHERE id = ?';

        const values = [package_id, faq_id, req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Faq Package not found.' });
            }

            res.status(200).json({ msg: 'Faq Package updated successfully.', resp: { package_id, faq_id } });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Delete FAQ package by ID
exports.deleteFaqPackage = async (req, res) => {
    try {
        const query = 'DELETE FROM FaqPackage WHERE id = ?';
        const values = [req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: "Data does not exist." });
            }

            res.status(200).json({ msg: 'Faq Package deleted successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};
