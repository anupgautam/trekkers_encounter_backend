const { Pool } = require("pg");
const client = require("../utils/db");


//posting the faq package
exports.postFaqPackage = async (req, res) => {
    try {
        const { package_id, faq_id } = req.body;

        const query = `
      INSERT INTO public."FaqPackage" (package_id, faq_id)
      VALUES ($1, $2)
      RETURNING *`;

        const values = [package_id, faq_id];

        const savedFaqPackage = await client.query(query, values);

        res.status(201).json({ msg: 'Faq Package Successfully Added.', resp: savedFaqPackage.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

//bulk faq
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

            const query = `
        INSERT INTO public."FaqPackage" (package_id, faq_id)
        VALUES ($1, $2)
        RETURNING *`;

            const values = [package_id, faq_id];

            const savedItem = await client.query(query, values);

            savedFaqPackages.push(savedItem.rows[0]);
        }

        res.status(201).json({ msg: 'Bulk FaqPackages Successfully Added.', resp: savedFaqPackages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

//get the faq package
exports.getFaqPackage = async (req, res) => {
    try {
        const getSub = await client.query('SELECT * FROM public."FaqPackage"');
        res.status(201).json(getSub.rows);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

//get request for faq package filtering by id
exports.getFaqPackageById = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."FaqPackage" WHERE id = $1';
        const values = [req.params.postId];

        const getItineraryId = await client.query(query, values);

        if (getItineraryId.rowCount === 0) {
            return res.status(404).json({ msg: 'Faq Package not found.' });
        }

        res.status(201).json(getItineraryId.rows[0]);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

//get request for faq package filtering by package
exports.getFaqByPackage = async (req, res) => {
    try {
        const package_id = req.params.package_id;
        const query = 'SELECT * FROM public."FaqPackage" WHERE package_id = $1';
        const values = [package_id];

        const getPackage = await client.query(query, values);
        res.status(200).json(getPackage.rows);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

//bulk update
exports.updateFaqPackageId = async (req, res) => {
    try {
        const { faqPackageItems } = req.body;

        if (!Array.isArray(faqPackageItems)) {
            return res.status(400).json({ msg: 'faqPackageItems should be an array.' });
        }

        const updatedFaqPackages = [];
        const { package_id } = faqPackageItems[0];

        const existingFaqIdsQuery = `
            SELECT faq_id FROM public."FaqPackage"
            WHERE package_id = $1`;
        const existingFaqIdsResult = await client.query(existingFaqIdsQuery, [package_id]);
        const existingFaqIds = existingFaqIdsResult.rows.map(row => row.faq_id);

        const faqIdsToDelete = existingFaqIds.filter(faqId => !faqPackageItems.some(selectedItem => selectedItem.faq_id === faqId));
        const faqIdsToInsertOrUpdate = faqPackageItems.filter(selectedItem => !existingFaqIds.includes(selectedItem.faq_id));

        for (const faqIdToDelete of faqIdsToDelete) {
            const deleteQuery = `
                DELETE FROM public."FaqPackage"
                WHERE package_id = $1 AND faq_id = $2`;
            await client.query(deleteQuery, [package_id, faqIdToDelete]);
        }

        for (const faqItemToInsertOrUpdate of faqIdsToInsertOrUpdate) {
            const { faq_id } = faqItemToInsertOrUpdate;
            const upsertQuery = `
                INSERT INTO public."FaqPackage" (package_id, faq_id)
                VALUES ($1, $2)
                ON CONFLICT (package_id, faq_id) DO UPDATE
                SET package_id = $1, faq_id = $2
                RETURNING *`;
            const upsertedFaqPackage = await client.query(upsertQuery, [package_id, faq_id]);
            updatedFaqPackages.push(upsertedFaqPackage.rows[0]);
        }

        res.status(200).json({ msg: 'Bulk FaqPackages Successfully Updated.', updatedFaqPackages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


//updating the faq package using id
exports.updateFaqPackage = async (req, res) => {
    try {
        const { package_id, faq_id } = req.body;
        const query = `
      UPDATE public."FaqPackage"
      SET package_id = $1, faq_id = $2
      WHERE id = $3
      RETURNING *`;

        const values = [package_id, faq_id, req.params.postId];

        const updateIti = await client.query(query, values);

        if (updateIti.rowCount === 0) {
            return res.status(404).json({ msg: 'Faq Package not found.' });
        }

        res.status(200).json({ msg: 'Faq Package updated successfully.', resp: updateIti.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

//delete request for faq package
exports.deleteFaqPackage = async (req, res) => {
    try {
        const query = 'DELETE FROM public."FaqPackage" WHERE id = $1';
        const values = [req.params.postId];

        const delIti = await client.query(query, values);

        if (delIti.rowCount === 0) {
            return res.status(404).json({ msg: "Data does not exist." });
        }

        res.status(201).json(delIti.rows[0]);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error.', error });
    }
};
