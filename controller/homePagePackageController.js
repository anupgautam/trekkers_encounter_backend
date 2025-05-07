const client = require('../utils/db');

// Posting the Home Page Package
exports.postHomePagePackage = async (req, res) => {
    let connection;
    try {
        const { package_id } = req.body;

        // Validate required fields
        if (!package_id) {
            return res.status(400).json({ msg: 'Package ID is required.' });
        }

        connection = await client.getConnection();
        const query = `INSERT INTO HomePackage (package_id) VALUES (?)`;
        const values = [package_id];

        const [result] = await connection.query(query, values);
        res.status(201).json({ msg: 'Home page package Successfully Added.', resp: { id: result.insertId, package_id } });
    } catch (error) {
        console.error("Error in postHomePagePackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get all Home Page Packages with Package details
exports.getAllHomePagePackage = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = `
            SELECT 
                HomePackage.id AS home_package_id,
                Package.id AS package_id,
                Package.category_id,
                Package.sub_category_id,
                Package.language_id,
                Package.title,
                Package.short_description,
                Package.description,
                Package.duration,
                Package.currency,
                Package.price,
                Package.package_image,
                Package.overall_ratings,
                Package.created_at,
                Package.updated_at,
                Package.sub_sub_category_id
            FROM HomePackage
            JOIN Package ON HomePackage.package_id = Package.id`;

        const [results] = await connection.query(query);

        const homePackages = results.map(row => ({
            home_package_id: row.home_package_id,
            id: row.package_id,
            category_id: row.category_id,
            sub_category_id: row.sub_category_id,
            language_id: row.language_id,
            title: row.title,
            short_description: row.short_description,
            description: row.description,
            duration: row.duration,
            currency: row.currency,
            price: row.price,
            package_image: row.package_image,
            overall_ratings: row.overall_ratings,
            created_at: row.created_at,
            updated_at: row.updated_at,
            sub_sub_category_id: row.sub_sub_category_id
        }));

        res.status(200).json(homePackages);
    } catch (error) {
        console.error("Error in getAllHomePagePackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get Home Page Package by ID
exports.getHomePagePackageById = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await client.getConnection();
        const query = `SELECT * FROM HomePackage WHERE id = ?`;
        const values = [id];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'HomePackage not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getHomePagePackageById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update Home Page Package by ID
exports.updateHomePagePackage = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { package_id } = req.body;

        // Validate required fields
        if (!package_id) {
            return res.status(400).json({ msg: 'Package ID is required.' });
        }

        connection = await client.getConnection();
        const query = `UPDATE HomePackage SET package_id = ? WHERE id = ?`;
        const values = [package_id, id];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Home package not found.' });
        }

        res.status(200).json({ msg: 'Home package updated successfully.', resp: { id, package_id } });
    } catch (error) {
        console.error("Error in updateHomePagePackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete Home Page Package by ID
exports.deleteHomePagePackage = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await client.getConnection();
        const query = `DELETE FROM HomePackage WHERE id = ?`;
        const values = [id];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Home Package not found.' });
        }

        res.status(200).json({ msg: 'Home Package deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteHomePagePackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};