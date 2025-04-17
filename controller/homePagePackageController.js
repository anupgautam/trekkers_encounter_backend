const mysql = require('../utils/db');

exports.postHomePagePackage = async (req, res) => {
    try {
        const { package_id } = req.body;

        const query = `
            INSERT INTO HomePackage (package_id)
            VALUES (?)`;

        const values = [package_id];

        mysql.query(query, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }
            res.status(201).json({ msg: 'Home page package Successfully Added.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

exports.getAllHomePagePackage = async (req, res) => {
    try {
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
            JOIN Package ON HomePackage.package_id = Package.id;
        `;

        mysql.query(query, (error, results) => {
            if (error) {
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

            // No need to group here if you're just returning all results
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
        });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};




exports.getHomePagePackageById = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `SELECT * FROM HomePackage WHERE id = ?`;

        mysql.query(query, [id], (error, results) => {
            if (error) return res.status(500).json({ msg: 'Server Error.', error: error.message });

            if (results.length === 0) {
                return res.status(404).json({ msg: 'HomePackage not found.' });
            }

            res.status(200).json(results[0]);
        });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


exports.updateHomePagePackage = async (req, res) => {
    const { id } = req.params;
    const { package_id } = req.body;

    try {
        const query = `UPDATE HomePackage SET package_id = ? WHERE id = ?`;
        const values = [package_id, id];

        mysql.query(query, values, (error, result) => {
            if (error) return res.status(500).json({ msg: 'Server Error.', error: error.message });

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Home package not found.' });
            }

            res.status(200).json({ msg: 'Home package updated successfully.' });
        });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};

exports.deleteHomePagePackage = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM HomePackage WHERE id = ?`;

        mysql.query(query, [id], (error, result) => {
            if (error) return res.status(500).json({ msg: 'Server Error.', error: error.message });

            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Home Package not found.' });
            }

            res.status(200).json({ msg: 'Home Package deleted successfully.' });
        });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    }
};


