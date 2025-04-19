const client = require('../utils/db');
const baseUrl = 'https://api.trekkersencounter.com';

// Posting the package gallery
exports.postPackageGallery = async (req, res) => {
    try {
        const { package_id } = req.body; 
        const image = `${baseUrl}/${req.file.path}`;

        const query = `
            INSERT INTO PackageGallery (package_id, image)
            VALUES (?, ?)`;

        const values = [package_id, image];

        client.execute(query, values, (error, result) => {
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



// Bulk creating package gallery
exports.postBulkPackageGallery = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded.' });
    }

    try {
        const package_id = req.body.package_id;
        const savedImages = [];

        for (const file of req.files) {
            const image = `${baseUrl}/${file.path}`;

            const query = `
                INSERT INTO PackageGallery (package_id, image)
                VALUES (?, ?)
            `;

            const values = [package_id, image];

            const result = await client.execute(query, values);
            savedImages.push({
                insertId: result.insertId,
                affectedRows: result.affectedRows
            });
        }

        // Check if the associated package exists by ID
        const packageQuery = 'SELECT * FROM Package WHERE id = ?';
        await client.execute(packageQuery, [package_id]);

        res.status(201).json({
            msg: 'Bulk Package Gallery Images Successfully Added.',
            resp: savedImages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


// Get the package gallery
exports.getPackageGallery = async (req, res) => {
    try {
        const query = 'SELECT * FROM PackageGallery';
        const [rows] = await client.execute(query);

        // Convert each row to a plain object
        const cleanResults = rows.map(row => ({ ...row }));

        res.status(200).json(cleanResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};



// Get package gallery by ID
exports.getPackageGalleryById = async (req, res) => {
    try {
        const galleryId = req.params.postId;
        const query = 'SELECT * FROM PackageGallery WHERE id = ?';
        const values = [galleryId];
        const [rows] = await client.execute(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Package Gallery not found.' });
        }

        // Return a clean object without circular references
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get package gallery by package ID
exports.getPackageGalleryByPackage = async (req, res) => {
    try {
        const packageId = req.params.package_id;
        const query = 'SELECT * FROM PackageGallery WHERE package_id = ?';
        const values = [packageId];

        client.execute(query, values, (error, result) => {
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




// Update the package gallery using ID
exports.updatePackageGallery = async (req, res) => {
    try {
        const galleryId = req.params.postId;

        if (!req.file || !req.file.path) {
            return res.status(400).json({ msg: 'Image file is missing.' });
        }

        const { package_id } = req.body;
        const image = `${baseUrl}/${req.file.path}`;

        const query = `
            UPDATE PackageGallery
            SET package_id = ?, image = ?
            WHERE id = ?
        `;

        const values = [package_id, image, galleryId];

        const [result] = await client.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Package Gallery not found.' });
        }

        res.status(200).json({
            msg: 'Package Gallery Updated Successfully.',
            resp: {
                affectedRows: result.affectedRows,
                changedRows: result.changedRows
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}


// Delete request for package gallery
exports.deletePackageGallery = async (req, res) => {
    try {
        const galleryId = req.params.postId;
        const query = 'DELETE FROM PackageGallery WHERE id = ?';
        const values = [galleryId];

        const [result] = await client.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Package Gallery not found.' });
        }

        res.status(200).json({ msg: 'Package Gallery deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}
