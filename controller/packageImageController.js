const mysql = require('../utils/db'); // Assuming mysql2 or mysql is used for MySQL connection

const baseUrl = 'https://api.trekkersencounter.com';

// Posting the package image
exports.postPackageImage = async (req, res) => {
    try {
        const { package_id } = req.body; 
        const image = `${baseUrl}/${req.file.path}`;

        const query = `
            INSERT INTO PackageImage (package_id, image)
            VALUES (?, ?)`;

        const values = [package_id, image];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            const newImage = { id: result.insertId, package_id, image };
            res.status(201).json({ msg: 'Package Image Successfully Added.', resp: newImage });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Posting multiple package images (bulk upload)
exports.postBulkPackageImages = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded.' });
    }

    try {
        const package_id = req.body.package_id;
        const savedImages = [];

        for (const file of req.files) {
            const image = `${baseUrl}/${file.path}`;

            const query = `
                INSERT INTO PackageImage (package_id, image)
                VALUES (?, ?)`;

            const values = [package_id, image];

            mysql.query(query, values, (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ msg: 'Server Error.', error: error.message });
                }
                savedImages.push({ id: result.insertId, package_id, image });
            });
        }

        res.status(201).json({ msg: 'Bulk Package Images Successfully Added.', resp: savedImages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Get request for package image
exports.getPackageImage = async (req, res) => {
    try {
        const query = 'SELECT * FROM PackageImage';

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

// Get request for package image by ID
exports.getPackageImageById = async (req, res) => {
    try {
        const imageId = req.params.postId;
        const query = 'SELECT * FROM PackageImage WHERE id = ?';
        const values = [imageId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            if (result.length === 0) {
                return res.status(404).json({ msg: 'Package Image not found.' });
            }
            res.status(200).json(result[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Get request for package image by package ID
exports.getPackageImageByPackageId = async (req, res) => {
    try {
        const packageId = req.params.package_id;
        const query = 'SELECT * FROM PackageImage WHERE package_id = ?';
        const values = [packageId];

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

// Updating the package image using ID
exports.updatePackageImage = async (req, res) => {
    try {
        const imageId = req.params.postId;

        if (!req.file || !req.file.path) {
            return res.status(400).json({ msg: 'Image file is missing.' });
        }

        const { package_id, update_at } = req.body;
        const image = `${baseUrl}/${req.file.path}`;

        const query = `
            UPDATE PackageImage
            SET package_id = ?, image = ?, update_at = ?
            WHERE id = ?
            LIMIT 1`;

        const values = [package_id, image, update_at, imageId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Package Image not found.' });
            }
            res.status(200).json({ msg: 'Package Image updated successfully.', resp: { id: imageId, package_id, image, update_at } });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

// Delete request for package image
exports.deletePackageImage = async (req, res) => {
    try {
        const imageId = req.params.postId;
        const query = 'DELETE FROM PackageImage WHERE id = ?';
        const values = [imageId];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Package Image not found.' });
            }
            res.status(200).json({ msg: 'Package Image deleted successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};
