const client = require('../utils/db'); // Use your PostgreSQL client

// Posting the include/exclude package
exports.postIncludeExcludePackage = async (req, res) => {
    try {
        const { package_id, include_exclude_id } = req.body;

        // Check if required fields are provided
        if (!package_id || !include_exclude_id) {
            return res.status(400).json({ msg: 'Missing required fields.' });
        }

        const query = `
      INSERT INTO public."IncludeExcludePackage" (package_id, include_exclude_id)
      VALUES ($1, $2)
      RETURNING *`;

        const values = [package_id, include_exclude_id];

        const savedIncludeExcludePackage = await client.query(query, values);

        // Check if the package and include_exclude exist, you can add this part here

        res.status(201).json({ msg: 'Include/Exclude Package Successfully Added.', resp: savedIncludeExcludePackage.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Posting the include/exclude bulk package
exports.postBulkIncludeExcludePackage = async (req, res) => {
    try {
        const { includeItems } = req.body;

        // Check if includeItems is an array
        if (!Array.isArray(includeItems)) {
            return res.status(400).json({ msg: 'includeItems should be an array.' });
        }

        const savedIncludeExcludeItems = [];

        for (const item of includeItems) {
            const { package_id, include_exclude_id } = item;

            // Check if required fields are provided
            if (!package_id || !include_exclude_id) {
                return res.status(400).json({ msg: 'Missing required fields.' });
            }

            const query = `
        INSERT INTO public."IncludeExcludePackage" (package_id, include_exclude_id)
        VALUES ($1, $2)
        RETURNING *`;

            const values = [package_id, include_exclude_id];

            const savedItem = await client.query(query, values);
            savedIncludeExcludeItems.push(savedItem.rows[0]);

            // You can optionally include code to fetch package and include_exclude records here
        }

        res.status(201).json({ msg: 'Bulk Include/Exclude Items Successfully Added.', resp: savedIncludeExcludeItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get the Include/Exclude Package
exports.getIncludeExcludePackage = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."IncludeExcludePackage"';
        const getIncludeExcludePackages = await client.query(query);
        res.status(200).json(getIncludeExcludePackages.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get Include/Exclude Package by ID
exports.getIncludeExcludePackageById = async (req, res) => {
    try {
        const { postId } = req.params;
        const query = 'SELECT * FROM public."IncludeExcludePackage" WHERE id = $1';
        const values = [postId];
        const getIncludeExcludePackage = await client.query(query, values);

        if (getIncludeExcludePackage.rows.length === 0) {
            return res.status(404).json({ msg: 'Include/Exclude Package not found.' });
        }

        res.status(200).json(getIncludeExcludePackage.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Get Include/Exclude Package by Package ID
exports.getIncludeExcludePackageByPackage = async (req, res) => {
    try {
        const package_id = req.params.package_id;
        const query = 'SELECT * FROM public."IncludeExcludePackage" WHERE package_id = $1';
        const values = [package_id];
        const getIncludeExcludePackages = await client.query(query, values);

        if (getIncludeExcludePackages.rows.length === 0) {
            return res.status(404).json({ msg: 'Include/Exclude Packages not found for the specified package.' });
        }

        res.status(200).json(getIncludeExcludePackages.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

//bulk update 
exports.updateIncludeExcludePackageId = async (req, res) => {
    try {
        const { includeItems } = req.body;

        // Check if includeItems is an array
        if (!Array.isArray(includeItems)) {
            return res.status(400).json({ msg: 'includeItems should be an array.' });
        }

        const updatedIncludeExcludeItems = [];
        const { package_id } = includeItems[0];

        // Fetch existing include_exclude items for the package_id
        const existingItemsQuery = `
            SELECT include_exclude_id FROM public."IncludeExcludePackage"
            WHERE package_id = $1`;
        const existingItemsResult = await client.query(existingItemsQuery, [package_id]);
        const existingItems = existingItemsResult.rows.map(row => row.include_exclude_id);

        // Identify items to delete and insert/update
        const itemsToDelete = existingItems.filter(item => !includeItems.some(selectedItem => selectedItem.include_exclude_id === item));
        const itemsToInsertOrUpdate = includeItems.filter(selectedItem => !existingItems.includes(selectedItem.include_exclude_id));

        // Delete items that were removed in the multi-select
        for (const itemToDelete of itemsToDelete) {
            const deleteQuery = `
                DELETE FROM public."IncludeExcludePackage"
                WHERE package_id = $1 AND include_exclude_id = $2`;
            await client.query(deleteQuery, [package_id, itemToDelete]);
        }

        // Insert or update newly selected items
        for (const itemToInsertOrUpdate of itemsToInsertOrUpdate) {
            const { include_exclude_id } = itemToInsertOrUpdate;
            const upsertQuery = `
                INSERT INTO public."IncludeExcludePackage" (package_id, include_exclude_id)
                VALUES ($1, $2)
                ON CONFLICT (package_id, include_exclude_id) DO UPDATE
                SET package_id = $1, include_exclude_id = $2
                RETURNING *`;
            const upsertedItem = await client.query(upsertQuery, [package_id, include_exclude_id]);
            updatedIncludeExcludeItems.push(upsertedItem.rows[0]);
        }

        res.status(200).json({ msg: 'Bulk Include/Exclude Items Successfully Updated.', updatedItems: updatedIncludeExcludeItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};



// Update Include/Exclude Package by ID
exports.updateIncludeExcludePackage = async (req, res) => {
    try {
        const { postId } = req.params;
        const { package_id, include_exclude_id } = req.body;

        const query = `
        UPDATE public."IncludeExcludePackage"
        SET package_id = $1, include_exclude_id = $2
        WHERE id = $3
        RETURNING *`;

        const values = [package_id, include_exclude_id, postId];
        const updateIncludeExcludePackage = await client.query(query, values);

        if (updateIncludeExcludePackage.rows.length === 0) {
            return res.status(404).json({ msg: 'Include/Exclude Package not found.' });
        }

        res.status(200).json({ msg: 'Include/Exclude Package updated successfully.', resp: updateIncludeExcludePackage.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

// Delete Include/Exclude Package by ID
exports.deleteIncludeExcludePackage = async (req, res) => {
    try {
        const { postId } = req.params;
        const query = 'DELETE FROM public."IncludeExcludePackage" WHERE id = $1 RETURNING *';
        const values = [postId];
        const deletedIncludeExcludePackage = await client.query(query, values);

        if (deletedIncludeExcludePackage.rows.length === 0) {
            return res.status(404).json({ msg: 'Include/Exclude Package not found.' });
        }

        res.status(200).json({ msg: 'Include/Exclude Package deleted successfully.', resp: deletedIncludeExcludePackage.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
}

