const client = require('../utils/db');

async function updatePackageAverageReview(packageId) {
    try {
        const query = `
            SELECT AVG(review_star) AS average_rating
            FROM public."ReviewTable"
            WHERE package_id = $1
        `;
        const values = [packageId];

        const result = await client.query(query, values);
        const averageRating = parseFloat(result.rows[0].average_rating) || 0;

        const updateQuery = `
            UPDATE public."Package"
            SET overall_ratings = $1
            WHERE id = $2
        `;
        const updateValues = [averageRating, packageId];

        await client.query(updateQuery, updateValues);
    } catch (error) {
        console.error(error);
    }
}

// Posting a review
exports.postReview = async (req, res) => {
    try {
        const { package_id, user_id, review_star, review_title, review_description } = req.body;

        // Check if the user has already reviewed this package
        const existingReviewQuery = `
            SELECT id
            FROM public."ReviewTable"
            WHERE package_id = $1 AND user_id = $2
        `;
        const existingReviewValues = [package_id, user_id];

        const existingReviewResult = await client.query(existingReviewQuery, existingReviewValues);

        if (existingReviewResult.rows.length > 0) {
            return res.status(400).json({ msg: 'You have already reviewed this package.' });
        }

        const insertReviewQuery = `
            INSERT INTO public."ReviewTable" (package_id, user_id, review_star, review_title, review_description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const insertReviewValues = [package_id, user_id, review_star, review_title, review_description];

        const savedReviewResult = await client.query(insertReviewQuery, insertReviewValues);
        const savedReview = savedReviewResult.rows[0];

        // Update the package's average rating based on the new review
        await updatePackageAverageReview(package_id);

        res.status(201).json({ msg: 'Review Successfully Added.', resp: savedReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get all reviews
exports.getReview = async (req, res) => {
    try {
        const query = 'SELECT * FROM public."ReviewTable"';
        const result = await client.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get a review by ID
exports.getReviewById = async (req, res) => {
    try {
        const reviewId = req.params.postId;
        const query = 'SELECT * FROM public."ReviewTable" WHERE id = $1';
        const values = [reviewId];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Review not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Get reviews by package
exports.getReviewByPackage = async (req, res) => {
    try {
        const packageId = req.params.package_id;
        const query = 'SELECT * FROM public."ReviewTable" WHERE package_id = $1';
        const values = [packageId];
        const result = await client.query(query, values);

        res.status(200).json(result.rows);
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
            FROM public."ReviewTable" r
            GROUP BY r.package_id
            ORDER BY total_reviews DESC
            LIMIT 5
        `;

        const result = await client.query(query);
        const packages = result.rows;

        const packageIds = packages.map((pkg) => pkg.package_id);

        const reviewQuery = `
            SELECT *
            FROM public."ReviewTable" r
            WHERE r.package_id = ANY($1)
        `;

        const reviewValues = [packageIds];
        const reviewsResult = await client.query(reviewQuery, reviewValues);
        const reviews = reviewsResult.rows;

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
            UPDATE public."ReviewTable"
            SET package_id = $1, user_id = $2, review_star = $3, review_title = $4, review_description = $5
            WHERE id = $6
            RETURNING *
        `;

        const values = [package_id, user_id, review_star, review_title, review_description, reviewId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Review not found or not modified.' });
        }

        // Update the package's average rating based on the updated review
        await updatePackageAverageReview(package_id);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

// Delete a review by ID
exports.deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.postId;
        const query = 'DELETE FROM public."ReviewTable" WHERE id = $1';
        const values = [reviewId];

        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Review not found.' });
        }

        // Get the associated package_id before deleting
        const getPackageIdQuery = 'SELECT package_id FROM public."ReviewTable" WHERE id = $1';
        const getPackageIdValues = [reviewId];
        const packageIdResult = await client.query(getPackageIdQuery, getPackageIdValues);

        // Update the package's average rating after the review is deleted
        if (packageIdResult.rows.length > 0) {
            const package_id = packageIdResult.rows[0].package_id;
            await updatePackageAverageReview(package_id);
        }

        res.status(200).json({ msg: 'Review deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};
