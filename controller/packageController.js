const mysql = require('../utils/db'); // Assuming this file contains the MySQL connection setup
const baseUrl = 'https://api.trekkersencounter.com';

// Posting the package
exports.postPackage = async (req, res) => {
    try {
        const { category_id, sub_category_id, title, short_description, description, duration, currency, price, overall_ratings, language_id } = req.body;
        const package_image = `${baseUrl}/${req.file.path}`;

        // Check if required fields are provided
        if (!category_id || !sub_category_id || !title || !short_description || !description || !duration || !currency || !price || !package_image || !language_id) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        const query = `
            INSERT INTO Package (category_id, sub_category_id, title, short_description, description, duration, currency, price, package_image, overall_ratings, language_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [category_id, sub_category_id, title, short_description, description, duration, currency, price, package_image, overall_ratings, language_id];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            res.status(201).json({ msg: 'Package Successfully Added.', resp: { id: result.insertId, ...req.body, package_image } });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Get request for the package
exports.getPackage = async (req, res) => {
    try {
        const query = 'SELECT * FROM Package';

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

// Get request for package pagination
exports.getPackagePagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limitPerPage = 10;
        const skip = (page - 1) * limitPerPage;

        const query = 'SELECT * FROM Package LIMIT ?, ?';
        const values = [skip, limitPerPage];

        mysql.query(query, values, (error, results) => {
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

// Get request for package filtering by id
exports.getPackageById = async (req, res) => {
    try {
        const query = 'SELECT * FROM Package WHERE id = ?';
        const values = [req.params.postId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ msg: 'Package not found.' });
            }
            res.status(200).json(result[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Get request for package filtering by category
exports.getPackageByCategory = async (req, res) => {
    try {
        const category_id = req.params.category_id;
        const query = 'SELECT * FROM Package WHERE category_id = ?';
        const values = [category_id];

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

// Get request for package filtering by sub-category
exports.getPackageBySubCategory = async (req, res) => {
    try {
        const sub_category_id = req.params.sub_category_id;
        const query = 'SELECT * FROM Package WHERE sub_category_id = ?';
        const values = [sub_category_id];

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

// Get request for package filtering by language
exports.getPackageByLanguage = async (req, res) => {
    try {
        const language_id = req.params.language_id;
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const skip = (page - 1) * perPage;

        const query = 'SELECT * FROM Package WHERE language_id = ? LIMIT ?, ?';
        const values = [language_id, skip, perPage];

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

// Update the package using id
exports.updatePackage = async (req, res) => {
    try {
        const packageId = req.params.postId;
        const updateFields = {
            category_id: req.body.category_id,
            sub_category_id: req.body.sub_category_id,
            title: req.body.title,
            short_description: req.body.short_description,
            description: req.body.description,
            duration: req.body.duration,
            currency: req.body.currency,
            price: req.body.price,
            overall_ratings: req.body.overall_ratings,
            language_id: req.body.language_id,
        };

        if (req.file && req.file.path) {
            updateFields.package_image = `${baseUrl}/${req.file.path}`;
        }

        const query = `
            UPDATE Package
            SET category_id = ?, sub_category_id = ?, title = ?, short_description = ?, description = ?, duration = ?, currency = ?, price = ?, package_image = ?, overall_ratings = ?, language_id = ?
            WHERE id = ?
            LIMIT 1`;

        const values = [
            updateFields.category_id,
            updateFields.sub_category_id,
            updateFields.title,
            updateFields.short_description,
            updateFields.description,
            updateFields.duration,
            updateFields.currency,
            updateFields.price,
            updateFields.package_image,
            updateFields.overall_ratings,
            updateFields.language_id,
            packageId,
        ];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Package not found.' });
            }
            res.status(200).json({ msg: 'Package updated successfully.', data: updateFields });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Delete request for package
exports.deletePackage = async (req, res) => {
    try {
        const packageId = req.params.postId;

        // Deleting related records first
        const deleteQueries = [
            { query: 'DELETE FROM IncludeExcludePackage WHERE package_id = ?', values: [packageId] },
            { query: 'DELETE FROM FaqPackage WHERE package_id = ?', values: [packageId] },
            { query: 'DELETE FROM Itinerary WHERE package_id = ?', values: [packageId] },
            { query: 'DELETE FROM EssentialInformation WHERE package_id = ?', values: [packageId] },
            { query: 'DELETE FROM PackageImage WHERE package_id = ?', values: [packageId] },
            { query: 'DELETE FROM PackageGallery WHERE package_id = ?', values: [packageId] },
            { query: 'DELETE FROM ReviewTable WHERE package_id = ?', values: [packageId] },
        ];

        for (const { query, values } of deleteQueries) {
            await new Promise((resolve, reject) => {
                mysql.query(query, values, (error) => {
                    if (error) {
                        reject(error);
                    }
                    resolve();
                });
            });
        }

        const deletePackageQuery = 'DELETE FROM Package WHERE id = ?';
        const deletePackageValues = [packageId];
        
        mysql.query(deletePackageQuery, deletePackageValues, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Package not found.' });
            }
            res.status(200).json({ msg: 'Package deleted successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};
