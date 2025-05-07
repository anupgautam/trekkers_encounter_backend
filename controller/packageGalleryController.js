const client = require('../utils/db');
const baseUrl = 'https://api.trekkersencounter.com';

// Posting the package gallery
exports.postPackageGallery = async (req, res) => {
    let connection;
    try {
        const { package_id } = req.body;
        const image = req.file ? `${baseUrl}/${req.file.path}` : null;

        // Validate required fields
        if (!package_id || !image) {
            return res.status(400).json({ msg: 'Missing required fields: package_id and image are required.' });
        }

        // Check if package exists
        const [packageResult] = await connection.query('SELECT id FROM Package WHERE id = ?', [package_id]);
        if (packageResult.length === 0) {
            return res.status(404).json({ msg: 'Package not found.' });
        }

        connection = await client.getConnection();
        const query = `
            INSERT INTO PackageGallery (package_id, image)
            VALUES (?, ?)`;
        const values = [package_id, image];

        const [result] = await connection.query(query, values);
        const newImage = { id: result.insertId, package_id, image };

        res.status(201).json({ msg: 'Package Image Successfully Added.', resp: newImage });
    } catch (error) {
        console.error("Error in postPackageGallery:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Bulk creating package gallery
exports.postBulkPackageGallery = async (req, res) => {
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
                INSERT INTO PackageGallery (package_id, image)
                VALUES (?, ?)`;
            const values = [package_id, image];

            const [result] = await connection.query(query, values);
            return { id: result.insertId, package_id, image };
        });

        const results = await Promise.all(insertPromises);
        savedImages.push(...results);

        res.status(201).json({ msg: 'Bulk Package Gallery Images Successfully Added.', resp: savedImages });
    } catch (error) {
        console.error("Error in postBulkPackageGallery:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get the package gallery
exports.getPackageGallery = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM PackageGallery';
        const [rows] = await connection.query(query);

        // Convert each row to a plain object
        const cleanResults = rows.map(row => ({ ...row }));

        res.status(200).json(cleanResults);
    } catch (error) {
        console.error("Error in getPackageGallery:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get package gallery by ID
exports.getPackageGalleryById = async (req, res) => {
    let connection;
    try {
        const galleryId = req.params.postId;
        connection = await client.getConnection();
        const query = 'SELECT * FROM PackageGallery WHERE id = ?';
        const values = [galleryId];
        const [rows] = await connection.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Package Gallery not found.' });
        }

        // Return a clean object without circular references
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error in getPackageGalleryById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get package gallery by package ID
exports.getPackageGalleryByPackage = async (req, res) => {
    let connection;
    try {
        const packageId = req.params.package_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM PackageGallery WHERE package_id = ?';
        const values = [packageId];

        const [results] = await connection.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getPackageGalleryByPackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update the package gallery using ID
exports.updatePackageGallery = async (req, res) => {
    let connection;
    try {
        const galleryId = req.params.postId;

        if (!req.file || !req.file.path) {
            return res.status(400).json({ msg: 'Image file is missing.' });
        }

        const { package_id } = req.body;
        const image = `${baseUrl}/${req.file.path}`;

        // Validate required field
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
            UPDATE PackageGallery
            SET package_id = ?, image = ?
            WHERE id = ?`;
        const values = [package_id, image, galleryId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Package Gallery not found.' });
        }

        res.status(200).json({
            msg: 'Package Gallery Updated Successfully.',
            resp: {
                id: galleryId,
                package_id,
                image,
                affectedRows: result.affectedRows,
                changedRows: result.changedRows
            }
        });
    } catch (error) {
        console.error("Error in updatePackageGallery:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete request for package gallery
exports.deletePackageGallery = async (req, res) => {
    let connection;
    try {
        const galleryId = req.params.postId;
        connection = await client.getConnection();
        const query = 'DELETE FROM PackageGallery WHERE id = ?';
        const values = [galleryId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Package Gallery not found.' });
        }

        res.status(200).json({ msg: 'Package Gallery deleted successfully.' });
    } catch (error) {
        console.error("Error in deletePackageGallery:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};