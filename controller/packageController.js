const client = require('../utils/db');
const baseUrl = 'https://api.trekkersencounter.com';

// Posting the package
exports.postPackage = async (req, res) => {
    let connection;
    try {
        const { 
            category_id, 
            sub_category_id, 
            sub_sub_category_id, 
            title, 
            short_description, 
            description, 
            duration, 
            currency, 
            price, 
            overall_ratings, 
            language_id 
        } = req.body;

        const package_image = req.file ? `${baseUrl}/${req.file.path}` : null;

        // Check if required fields are provided
        if (!category_id || !title || !short_description || !description || !duration || !currency || !price || !package_image || !language_id) {
            return res.status(400).json({ msg: 'Missing required fields: category_id, title, short_description, description, duration, currency, price, package_image, and language_id are required.' });
        }

        connection = await client.getConnection();
        const query = `
            INSERT INTO Package 
            (category_id, sub_category_id, sub_sub_category_id, title, short_description, description, duration, currency, price, package_image, overall_ratings, language_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            category_id, 
            sub_category_id || null,
            sub_sub_category_id || null, 
            title, 
            short_description, 
            description, 
            duration, 
            currency, 
            price, 
            package_image, 
            overall_ratings || null, 
            language_id
        ];

        const [result] = await connection.query(query, values);
        const newPackage = { id: result.insertId, category_id, sub_category_id, sub_sub_category_id, title, short_description, description, duration, currency, price, package_image, overall_ratings, language_id };

        res.status(201).json({ msg: 'Package Successfully Added.', resp: newPackage });
    } catch (error) {
        console.error("Error in postPackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for the package
exports.getPackage = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Package';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getPackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for package pagination
exports.getPackagePagination = async (req, res) => {
    let connection;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        connection = await client.getConnection();

        // Get total count for pagination metadata
        const countQuery = 'SELECT COUNT(*) as total FROM Package';
        const [[{ total }]] = await connection.query(countQuery);

        // Get paginated results
        const query = 'SELECT * FROM Package LIMIT ? OFFSET ?';
        const values = [limit, offset];

        const [results] = await connection.query(query, values);

        res.status(200).json({
            data: results,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error in getPackagePagination:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for package filtering by id
exports.getPackageById = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM Package WHERE id = ?';
        const values = [req.params.postId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Package not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getPackageById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for package filtering by category
exports.getPackageByCategory = async (req, res) => {
    let connection;
    try {
        const category_id = req.params.category_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM Package WHERE category_id = ?';
        const values = [category_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getPackageByCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for package filtering by sub-category
exports.getPackageBySubCategory = async (req, res) => {
    let connection;
    try {
        const sub_category_id = req.params.sub_category_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM Package WHERE sub_category_id = ?';
        const values = [sub_category_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getPackageBySubCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for package filtering by sub sub-category
exports.getPackageBySubSubCategory = async (req, res) => {
    let connection;
    try {
        const sub_sub_category_id = req.params.sub_sub_category_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM Package WHERE sub_sub_category_id = ?';
        const values = [sub_sub_category_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getPackageBySubSubCategory:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for package filtering by language
exports.getPackageByLanguage = async (req, res) => {
    let connection;
    try {
        const language_id = req.params.language_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM Package WHERE language_id = ?';
        const values = [language_id];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getPackageByLanguage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update the package using id
exports.updatePackage = async (req, res) => {
    let connection;
    try {
        const packageId = req.params.postId;
        connection = await client.getConnection();

        // Fetch existing package data
        const selectQuery = `SELECT * FROM Package WHERE id = ? LIMIT 1`;
        const [results] = await connection.query(selectQuery, [packageId]);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Package not found.' });
        }

        const existingPackage = results[0];

        // Merge new values with existing values
        const updateFields = {
            category_id: req.body.category_id ?? existingPackage.category_id,
            sub_category_id: req.body.sub_category_id ?? existingPackage.sub_category_id,
            sub_sub_category_id: req.body.sub_sub_category_id ?? existingPackage.sub_sub_category_id,
            title: req.body.title ?? existingPackage.title,
            short_description: req.body.short_description ?? existingPackage.short_description,
            description: req.body.description ?? existingPackage.description,
            duration: req.body.duration ?? existingPackage.duration,
            currency: req.body.currency ?? existingPackage.currency,
            price: req.body.price ?? existingPackage.price,
            overall_ratings: req.body.overall_ratings ?? existingPackage.overall_ratings,
            language_id: req.body.language_id ?? existingPackage.language_id,
            package_image: req.file && req.file.path ? `${baseUrl}/${req.file.path}` : existingPackage.package_image,
        };

        const updateQuery = `
            UPDATE Package
            SET category_id = ?, sub_category_id = ?, sub_sub_category_id = ?, title = ?, short_description = ?, description = ?, duration = ?, currency = ?, price = ?, package_image = ?, overall_ratings = ?, language_id = ?
            WHERE id = ?
            LIMIT 1`;
        const values = [
            updateFields.category_id,
            updateFields.sub_category_id,
            updateFields.sub_sub_category_id,
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

        const [result] = await connection.query(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Package not found.' });
        }

        res.status(200).json({ msg: 'Package updated successfully.', resp: { id: packageId, ...updateFields } });
    } catch (error) {
        console.error("Error in updatePackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete request for package
exports.deletePackage = async (req, res) => {
    let connection;
    try {
        const packageId = req.params.postId;
        connection = await client.getConnection();

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

        await Promise.all(deleteQueries.map(async ({ query, values }) => {
            await connection.query(query, values);
        }));

        // Delete the package
        const deletePackageQuery = 'DELETE FROM Package WHERE id = ?';
        const deletePackageValues = [packageId];

        const [result] = await connection.query(deletePackageQuery, deletePackageValues);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Package not found.' });
        }

        res.status(200).json({ msg: 'Package deleted successfully.' });
    } catch (error) {
        console.error("Error in deletePackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};