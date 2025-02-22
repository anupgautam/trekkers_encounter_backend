const client = require('../utils/db');
const baseUrl = 'http://localhost:8888';



//posting the package gallery
exports.postPackageGallery = async (req, res) => {
    try {
        const { package_id } = req.body;
        const image = `${baseUrl}/${req.file.path}`;

        const query = `
            INSERT INTO public."PackageGallery" (package_id, image)
            VALUES ($1, $2)
            RETURNING *`;

        const values = [package_id, image];

        const result = await client.query(query, values);

        // Check if the associated package exists by ID (assuming "package_id" is a valid package ID)
        const packageQuery = 'SELECT * FROM public."Package" WHERE id = $1';
        await client.query(packageQuery, [package_id]);

        res.status(201).json({ msg: 'Package gallery Successfully Added.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

//bulk creating api
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
                INSERT INTO public."PackageGallery" (package_id, image)
                VALUES ($1, $2)
                RETURNING *`;

            const values = [package_id, image];

            const result = await client.query(query, values);
            savedImages.push(result.rows[0]);
        }

        // Check if the associated package exists by ID (assuming "package_id" is a valid package ID)
        const packageQuery = 'SELECT * FROM public."Package" WHERE id = $1';
        const packageResult = await client.query(packageQuery, [package_id]);

        res.status(201).json({ msg: 'Bulk Package Gallery Images Successfully Added.', resp: packageResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

//get the package Gallery
exports.getPackageGallery = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."PackageGallery"';
        const result = await client.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

//get request for package Gallery filtering by id
exports.getPackageGalleryById = async (req, res) => {
    try {
        const galleryId = req.params.postId;
        const query = 'SELECT * FROM public."PackageGallery" WHERE id = $1';
        const values = [galleryId];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Package Gallery not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

//get request for package gallery filtering by package
exports.getPackageGalleryByPackage = async (req, res) => {
    try {
        const packageId = req.params.package_id;
        const query = 'SELECT * FROM public."PackageGallery" WHERE package_id = $1';
        const values = [packageId];
        const result = await client.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}


// Updating the package gallery using id
exports.updatePackageGallery = async (req, res) => {
    try {
        const galleryId = req.params.postId;

        if (!req.file || !req.file.path) {
            return res.status(400).json({ msg: 'Image file is missing.' });
        }

        const { package_id } = req.body;
        const image = `${baseUrl}/${req.file.path}`;

        const query = `
            UPDATE public."PackageGallery"
            SET package_id = $1, image = $2
            WHERE id = $3
            RETURNING *`;

        const values = [package_id, image, galleryId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Package Gallery not found.' });
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

//delete request for package gallery
exports.deletePackagegallery = async (req, res) => {
    try {
        const galleryId = req.params.postId;
        const query = 'DELETE FROM public."PackageGallery" WHERE id = $1';
        const values = [galleryId];

        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Package Gallery not found.' });
        }

        res.status(200).json({ msg: 'Package Gallery deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}