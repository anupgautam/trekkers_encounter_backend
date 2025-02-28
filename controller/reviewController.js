const client = require('../utils/db'); // Assuming you already have MySQL client set up.

async function updatePackageAverageReview(packageId) {
    try {
        const query = `
            SELECT AVG(review_star) AS average_rating
            FROM ReviewTable
            WHERE package_id = ?
        `;
        const [rows] = await client.execute(query, [packageId]);
        const averageRating = parseFloat(rows[0].average_rating) || 0;

        const updateQuery = `
            UPDATE Package
            SET overall_ratings = ?
            WHERE id = ?
        `;
        await client.execute(updateQuery, [averageRating, packageId]);
    } catch (error) {
        console.error(error);
    }
}


// Posting a review// Posting a review
exports.postReview = async (req, res) => {
    try {
        const { package_id, user_id, review_star, review_title, review_description } = req.body;

        // Check if the user has already reviewed this package
        const existingReviewQuery = `
            SELECT id
            FROM ReviewTable
            WHERE package_id = ? AND user_id = ?
        `;
        const [existingReviewResult] = await client.execute(existingReviewQuery, [package_id, user_id]);

        if (existingReviewResult.length > 0) {
            return res.status(400).json({ msg: 'You have already reviewed this package.' });
        }

        const insertReviewQuery = `
            INSERT INTO ReviewTable (package_id, user_id, review_star, review_title, review_description)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [savedReviewResult] = await client.execute(insertReviewQuery, [package_id, user_id, review_star, review_title, review_description]);

        // Update the package's average rating based on the new review
        await updatePackageAverageReview(package_id);

        res.status(201).json({ msg: 'Review Successfully Added.', resp: savedReviewResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};


// Get all reviews
// Get all reviews
exports.getReview = async (req, res) => {
    try {
        const query = 'SELECT * FROM ReviewTable';
        const [result] = await client.execute(query);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get a review by ID
exports.getReviewById = async (req, res) => {
    try {
        const reviewId = req.params.postId;
        const query = 'SELECT * FROM ReviewTable WHERE id = ?';
        const [result] = await client.execute(query, [reviewId]);

        if (result.length === 0) {
            return res.status(404).json({ msg: 'Review not found.' });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get reviews by package
exports.getReviewByPackage = async (req, res) => {
    try {
        const packageId = req.params.package_id;
        const query = 'SELECT * FROM ReviewTable WHERE package_id = ?';
        const [result] = await client.execute(query, [packageId]);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};


// Get most reviewed packages and their reviews
exports.getMostReviewedPackages = async (req, res) => {
    try {
        const query = `
            SELECT r.package_id, COUNT(r.id) AS total_reviews
            FROM ReviewTable r
            GROUP BY r.package_id
            ORDER BY total_reviews DESC
            LIMIT 5
        `;

        const [result] = await client.execute(query);
        const packages = result;

        const packageIds = packages.map((pkg) => pkg.package_id);

        const reviewQuery = `
            SELECT *
            FROM ReviewTable r
            WHERE r.package_id IN (?)
        `;
        const [reviewsResult] = await client.execute(reviewQuery, [packageIds.join(',')]);
        const reviews = reviewsResult;

        res.status(200).json({ packages, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};


// Update a review by ID
exports.updateReview = async (req, res) => {
    try {
        const reviewId = req.params.postId;
        const { package_id, user_id, review_star, review_title, review_description } = req.body;

        const query = `
            UPDATE ReviewTable
            SET package_id = ?, user_id = ?, review_star = ?, review_title = ?, review_description = ?
            WHERE id = ?
        `;
        const [result] = await client.execute(query, [package_id, user_id, review_star, review_title, review_description, reviewId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Review not found or not modified.' });
        }

        // Update the package's average rating based on the updated review
        await updatePackageAverageReview(package_id);

        res.status(201).json({ msg: 'Review Updated Successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Delete a review by ID
exports.deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.postId;
        const query = 'DELETE FROM ReviewTable WHERE id = ?';
        const [result] = await client.execute(query, [reviewId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Review not found.' });
        }

        // Get the associated package_id before deleting
        const getPackageIdQuery = 'SELECT package_id FROM ReviewTable WHERE id = ?';
        const [packageIdResult] = await client.execute(getPackageIdQuery, [reviewId]);

        // Update the package's average rating after the review is deleted
        if (packageIdResult.length > 0) {
            const package_id = packageIdResult[0].package_id;
            await updatePackageAverageReview(package_id);
        }

        res.status(200).json({ msg: 'Review deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};


