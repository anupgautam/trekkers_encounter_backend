const client = require('../utils/db');
const baseUrl = 'https://api.trekkersencounter.com';

// Posting the package image
exports.postPackageImage = async (req, res) => {
    let connection;
    try {
        const { package_id } = req.body;
        const image = req.file ? `${baseUrl}/${req.file.path}` : null;

        // Validate required fields
        if (!package_id || !image) {
            return res.status(400).json({ msg: 'Missing required fields: package_id and image are required.' });
        }

        // Check if package exists
        connection = await client.getConnection();
        const [packageResult] = await connection.query('SELECT id FROM Package WHERE id = ?', [package_id]);
        if (packageResult.length === 0) {
            return res.status(404).json({ msg: 'Package not found.' });
        }

        const query = `
            INSERT INTO PackageImage (package_id, image)
            VALUES (?, ?)`;
        const values = [package_id, image];

        const [result] = await connection.query(query, values);
        const newImage = { id: result.insertId, package_id, image };

        res.status(201).json({ msg: 'Package Image Successfully Added.', resp: newImage });
    } catch (error) {
        console.error("Error in postPackageImage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Posting multiple package images (bulk upload)
exports.postBulkPackageImages = async (req, res) => {
    let connection;
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ msg: 'No files uploaded.' });
        }

        const package_id = req.body.package_id;

        // Validate required field
        if (!package_id) {
            return res.status(400).json({ msg: 'Package ID is required.' });
        }

        // Check if package exists
        connection = await client.getConnection();
        const [packageResult] = await connection.query('SELECT id FROM Package WHERE id = ?', [package_id]);
        if (packageResult.length === 0) {
            return res.status(404).json({ msg: 'Package not found.' });
        }

        const savedImages = [];

        const insertPromises = req.files.map(async (file) => {
            const image = `${baseUrl}/${file.path}`;
            const query = `
                INSERT INTO PackageImage (package_id, image)
                VALUES (?, ?)`;
            const values = [package_id, image];

            const [result] = await connection.query(query, values);
            return { id: result.insertId, package_id, image };
        });

        const results = await Promise.all(insertPromises);
        savedImages.push(...results);

        res.status(201).json({ msg: 'Bulk Package Images Successfully Added.', resp: savedImages });
    } catch (error) {
        console.error("Error in postBulkPackageImages:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for package image
exports.getPackageImage = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM PackageImage';

        const [results] = await connection.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getPackageImage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for package image by ID
exports.getPackageImageById = async (req, res) => {
    let connection;
    try {
        const imageId = req.params.postId;
        connection = await client.getConnection();
        const query = 'SELECT * FROM PackageImage WHERE id = ?';
        const values = [imageId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Package Image not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getPackageImageById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for package image by package ID
exports.getPackageImageByPackageId = async (req, res) => {
    let connection;
    try {
        const packageId = req.params.package_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM PackageImage WHERE package_id = ?';
        const values = [packageId];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getPackageImageByPackageId:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Updating the package image using ID
exports.updatePackageImage = async (req, res) => {
    let connection;
    try {
        const imageId = req.params.postId;

        if (!req.file || !req.file.path) {
            return res.status(400).json({ msg: 'Image file is missing.' });
        }

        const { package_id, updated_at } = req.body; // Changed update_at to updated_at
        const image = `${baseUrl}/${req.file.path}`;

        // Validate required fields
        if (!package_id) {
            return res.status(400).json({ msg: 'Package ID is required.' });
        }

        // Check if package exists
        const [packageResult] = await connection.query('SELECT id FROM Package WHERE id = ?', [package_id]);
        if (packageResult.length === 0) {
            return res.status(404).json({ msg: 'Package not found.' });
        }

        connection = await client.getConnection();
        const query = `
            UPDATE PackageImage
            SET package_id = ?, image = ?, updated_at = ?
            WHERE id = ?
            LIMIT 1`;
        const values = [package_id, image, updated_at || new Date(), imageId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Package Image not found.' });
        }

        res.status(200).json({ msg: 'Package Image updated successfully.', resp: { id: imageId, package_id, image, updated_at: updated_at || new Date() } });
    } catch (error) {
        console.error("Error in updatePackageImage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete request for package image
exports.deletePackageImage = async (req, res) => {
    let connection;
    try {
        const imageId = req.params.postId;
        connection = await client.getConnection();
        const query = 'DELETE FROM PackageImage WHERE id = ?';
        const values = [imageId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Package Image not found.' });
        }

        res.status(200).json({ msg: 'Package Image deleted successfully.' });
    } catch (error) {
        console.error("Error in deletePackageImage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};