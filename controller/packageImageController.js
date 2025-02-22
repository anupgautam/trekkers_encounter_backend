const client = require('../utils/db');

const baseUrl = 'http://localhost:8888';



//posting the package image
exports.postPackageImage = async (req, res) => {
    try {
        const { package_id, update_at } = req.body;
        const image = `${baseUrl}/${req.file.path}`;

        const query = `
            INSERT INTO public."PackageImage" (package_id, image, update_at)
            VALUES ($1, $2, $3)
            RETURNING *`;

        const values = [package_id, image, update_at];

        const result = await client.query(query, values);

        res.status(201).json({ msg: 'Package Image Successfully Added.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

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
                INSERT INTO public."PackageImage" (package_id, image)
                VALUES ($1, $2)
                RETURNING *`;

            const values = [package_id, image];

            const result = await client.query(query, values);
            savedImages.push(result.rows[0]);
        }

        res.status(201).json({ msg: 'Bulk Package Images Successfully Added.', resp: savedImages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}


//get request for package image
exports.getPackageImage = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."PackageImage"';
        const result = await client.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

//get request for package image filtering by id
exports.getPackageImageById = async (req, res) => {
    try {
        const imageId = req.params.postId;
        const query = 'SELECT * FROM public."PackageImage" WHERE id = $1';
        const values = [imageId];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Package Image not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

//get request for package image by package id
exports.getPackageImageByPackageId = async (req, res) => {
    try {
        const packageId = req.params.package_id;
        const query = 'SELECT * FROM public."PackageImage" WHERE package_id = $1';
        const values = [packageId];
        const result = await client.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}


//updating the package image using id
exports.updatePackageImage = async (req, res) => {
    try {
        const imageId = req.params.postId;

        if (!req.file || !req.file.path) {
            return res.status(400).json({ msg: 'Image file is missing.' });
        }

        const { package_id, update_at } = req.body;
        const image = `${baseUrl}/${req.file.path}`;

        const query = `
            UPDATE public."PackageImage"
            SET package_id = $1, image = $2, update_at = $3
            WHERE id = $4
            RETURNING *`;

        const values = [package_id, image, update_at, imageId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Package Image not found.' });
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

//delete request for category
exports.deletePackageImage = async (req, res) => {
    try {
        const imageId = req.params.postId;
        const query = 'DELETE FROM public."PackageImage" WHERE id = $1';
        const values = [imageId];

        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Package Image not found.' });
        }

        res.status(200).json({ msg: 'Package Image deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}