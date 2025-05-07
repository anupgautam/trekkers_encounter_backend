const client = require('../utils/db');

async function updatePackageAverageReview(packageId, connection) {
    try {
        const query = `
            SELECT AVG(review_star) AS average_rating
            FROM ReviewTable
            WHERE package_id = ?
        `;
        const [rows] = await connection.query(query, [packageId]);
        const averageRating = parseFloat(rows[0].average_rating) || 0;

        const updateQuery = `
            UPDATE Package
            SET overall_ratings = ?
            WHERE id = ?
        `;
        await connection.query(updateQuery, [averageRating, packageId]);
    } catch (error) {
        console.error("Error in updatePackageAverageReview:", error);
        throw error; // Re-throw to be handled by the caller
    }
}

// Posting a review
exports.postReview = async (req, res) => {
    let connection;
    try {
        const { package_id, user_id, review_star, review_title, review_description } = req.body;

        // Validate required fields
        if (!package_id || !user_id || !review_star || !review_title || !review_description) {
            return res.status(400).json({ msg: 'Missing required fields: package_id, user_id, review_star, review_title, and review_description are required.' });
        }

        connection = await client.getConnection();

        // Check if the user has already reviewed this package
        const existingReviewQuery = `
            SELECT id
            FROM ReviewTable
            WHERE package_id = ? AND user_id = ?
        `;
        const [existingReviewResult] = await connection.query(existingReviewQuery, [package_id, user_id]);

        if (existingReviewResult.length > 0) {
            return res.status(400).json({ msg: 'You have already reviewed this package.' });
        }

        const insertReviewQuery = `
            INSERT INTO ReviewTable (package_id, user_id, review_star, review_title, review_description)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [savedReviewResult] = await connection.query(insertReviewQuery, [package_id, user_id, review_star, review_title, review_description]);

        // Update the package's average rating based on the new review
        await updatePackageAverageReview(package_id, connection);

        res.status(201).json({ msg: 'Review Successfully Added.', resp: { id: savedReviewResult.insertId, package_id, user_id, review_star, review_title, review_description } });
    } catch (error) {
        console.error("Error in postReview:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get all reviews
exports.getReview = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const query = 'SELECT * FROM ReviewTable';
        const [result] = await connection.query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getReview:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get a review by ID
exports.getReviewById = async (req, res) => {
    let connection;
    try {
        const reviewId = req.params.postId;
        connection = await client.getConnection();
        const query = 'SELECT * FROM ReviewTable WHERE id = ?';
        const [result] = await connection.query(query, [reviewId]);

        if (result.length === 0) {
            return res.status(404).json({ msg: 'Review not found.' });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error in getReviewById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get reviews by package
exports.getReviewByPackage = async (req, res) => {
    let connection;
    try {
        const packageId = req.params.package_id;
        connection = await client.getConnection();
        const query = 'SELECT * FROM ReviewTable WHERE package_id = ?';
        const [result] = await connection.query(query, [packageId]);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getReviewByPackage:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get most reviewed packages and their reviews
exports.getMostReviewedPackages = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();

        // Query to get the most reviewed packages
        const query = `
            SELECT r.package_id, COUNT(r.id) AS total_reviews
            FROM ReviewTable r
            GROUP BY r.package_id
            ORDER BY total_reviews DESC
            LIMIT 5
        `;
        const [packages] = await connection.query(query);

        if (!packages || packages.length === 0) {
            return res.status(404).json({ msg: 'No packages found.' });
        }

        const packageIds = packages.map((pkg) => pkg.package_id);

        // Query to get reviews for the selected packages
        const reviewQuery = `
            SELECT *
            FROM ReviewTable r
            WHERE r.package_id IN (${packageIds.map(() => '?').join(',')})
        `;
        const reviewValues = packageIds;

        const [reviews] = await connection.query(reviewQuery, reviewValues);

        res.status(200).json({ packages, reviews });
    } catch (error) {
        console.error("Error in getMostReviewedPackages:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Update a review by ID
exports.updateReview = async (req, res) => {
    let connection;
    try {
        const reviewId = req.params.postId;
        const { package_id, user_id, review_star, review_title, review_description } = req.body;

        // Validate required fields
        if (!package_id || !user_id || !review_star || !review_title || !review_description) {
            return res.status(400).json({ msg: 'Missing required fields: package_id, user_id, review_star, review_title, and review_description are required.' });
        }

        connection = await client.getConnection();
        const query = `
            UPDATE ReviewTable
            SET package_id = ?, user_id = ?, review_star = ?, review_title = ?, review_description = ?
            WHERE id = ?
        `;
        const [result] = await connection.query(query, [package_id, user_id, review_star, review_title, review_description, reviewId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Review not found or not modified.' });
        }

        // Update the package's average rating based on the updated review
        await updatePackageAverageReview(package_id, connection);

        res.status(200).json({ msg: 'Review Updated Successfully.', resp: { id: reviewId, package_id, user_id, review_star, review_title, review_description } });
    } catch (error) {
        console.error("Error in updateReview:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete a review by ID
exports.deleteReview = async (req, res) => {
    let connection;
    try {
        const reviewId = req.params.postId;
        connection = await client.getConnection();

        // Get the associated package_id before deleting
        const getPackageIdQuery = 'SELECT package_id FROM ReviewTable WHERE id = ?';
        const [packageIdResult] = await connection.query(getPackageIdQuery, [reviewId]);

        const query = 'DELETE FROM ReviewTable WHERE id = ?';
        const [result] = await connection.query(query, [reviewId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Review not found.' });
        }

        // Update the package's average rating after the review is deleted
        if (packageIdResult.length > 0) {
            const package_id = packageIdResult[0].package_id;
            await updatePackageAverageReview(package_id, connection);
        }

        res.status(200).json({ msg: 'Review deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteReview:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};