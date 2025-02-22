const client = require('../utils/db'); // Import your PostgreSQL client
const baseUrl = 'http://localhost:8888'

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
            INSERT INTO public."Package" (category_id, sub_category_id, title, short_description, description, duration, currency, price, package_image, overall_ratings, language_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`;

        const values = [category_id, sub_category_id, title, short_description, description, duration, currency, price, package_image, overall_ratings, language_id];

        const savedPackage = await client.query(query, values);

        res.status(201).json({ msg: 'Package Successfully Added.', resp: savedPackage.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get request for the package
exports.getPackage = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Package"';
        const result = await client.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get request for the package pagination
exports.getPackagePagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limitPerPage = 10;
        const skip = (page - 1) * limitPerPage;

        const query = 'SELECT * FROM public."Package" OFFSET $1 LIMIT $2';
        const values = [skip, limitPerPage];

        const result = await client.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get request for package filtering by id
exports.getPackageById = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."Package" WHERE id = $1';
        const values = [req.params.postId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Package not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}
// Get request for package filtering by category
exports.getPackageByCategory = async (req, res) => {
    try {
        const category_id = req.params.category_id;
        const query = 'SELECT * FROM public."Package" WHERE category_id = $1';
        const values = [category_id];

        const result = await client.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get request for package filtering by sub category
exports.getPackageBySubCategory = async (req, res) => {
    try {
        const sub_category_id = req.params.sub_category_id;
        const query = 'SELECT * FROM public."Package" WHERE sub_category_id = $1';
        const values = [sub_category_id];

        const result = await client.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get request for package filtering by language
exports.getPackageByLanguage = async (req, res) => {
    try {
        const language_id = req.params.language_id;
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const skip = (page - 1) * perPage;

        const query = 'SELECT * FROM public."Package" WHERE language_id = $1 OFFSET $2 LIMIT $3';
        const values = [language_id, skip, perPage];

        const result = await client.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

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
            UPDATE public."Package"
            SET category_id = $1, sub_category_id = $2, title = $3, short_description = $4, description = $5, duration = $6, currency = $7, price = $8, package_image = $9, overall_ratings = $10, language_id = $11
            WHERE id = $12
            RETURNING *`;

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

        const updatedPackage = await client.query(query, values);

        if (updatedPackage.rows.length === 0) {
            return res.status(404).json({ msg: 'Package not found.' });
        }

        res.status(200).json({ msg: 'Package updated successfully.', data: updatedPackage.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Delete request for package
exports.deletePackage = async (req, res) => {
    try {
        const packageId = req.params.postId;

        const deleteIncludeExcludePackageQuery = 'DELETE FROM public."IncludeExcludePackage" WHERE package_id = $1';
        const deleteIncludeExcludePackageValues = [packageId];
        await client.query(deleteIncludeExcludePackageQuery, deleteIncludeExcludePackageValues);

        const deleteFaqPackageQuery = 'DELETE FROM public."FaqPackage" WHERE package_id = $1';
        const deleteFaqPackageValues = [packageId];
        await client.query(deleteFaqPackageQuery, deleteFaqPackageValues);

        const deleteItiPackageQuery = 'DELETE FROM public."Itinerary" WHERE package_id = $1';
        const deleteItiPackageValues = [packageId];
        await client.query(deleteItiPackageQuery, deleteItiPackageValues);

        const deleteEssPackageQuery = 'DELETE FROM public."EssentialInformation" WHERE package_id = $1';
        const deleteEssPackageValues = [packageId];
        await client.query(deleteEssPackageQuery, deleteEssPackageValues);

        const deletePacImgPackageQuery = 'DELETE FROM public."PackageImage" WHERE package_id = $1';
        const deletePacImgPackageValues = [packageId];
        await client.query(deletePacImgPackageQuery, deletePacImgPackageValues);

        const deletePacGalPackageQuery = 'DELETE FROM public."PackageGallery" WHERE package_id = $1';
        const deletePacGalPackageValues = [packageId];
        await client.query(deletePacGalPackageQuery, deletePacGalPackageValues);

        const deletePacRevPackageQuery = 'DELETE FROM public."ReviewTable" WHERE package_id = $1';
        const deletePacRevPackageValues = [packageId];
        await client.query(deletePacRevPackageQuery, deletePacRevPackageValues);

        const deletePackageQuery = 'DELETE FROM public."Package" WHERE id = $1';
        const deletePackageValues = [packageId];
        const result = await client.query(deletePackageQuery, deletePackageValues);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Package not found.' });
        }

        res.status(200).json({ msg: 'Package deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}
