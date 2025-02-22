const client = require('../utils/db');

// Posting the Booking
exports.postBooking = async (req, res) => {
    try {
        // Extract data from the request body
        const { package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no } = req.body;

        // Validate the date
        const bookingDate = new Date(booked_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (bookingDate < today) {
            return res.status(400).json({ msg: 'Booking date must be today or a future date.' });
        }

        const query = `
            INSERT INTO public."PackageBooking" (package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`;

        const values = [package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no];

        const result = await client.query(query, values);

        res.status(201).json({ msg: 'Booking Successfully Added.', resp: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// Get request for booking
exports.getBooking = async (req, res) => {
    try {
        // Build your SELECT query based on the request parameters
        const { status } = req.query;
        const query = status ? `SELECT * FROM public."PackageBooking" WHERE status = $1` : `SELECT * FROM public."PackageBooking"`;
        const values = status ? [status] : [];

        const result = await client.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// Get request for booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.postId;
        const query = 'SELECT * FROM public."PackageBooking" WHERE id = $1';
        const values = [bookingId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Booking not found.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// Update the booking using ID
exports.updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.postId;
        const { package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no, update_at } = req.body;

        // Validate the date
        const bookingDate = new Date(booked_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (bookingDate < today) {
            return res.status(400).json({ msg: 'Booking date must be today or a future date.' });
        }

        const query = `
            UPDATE public."PackageBooking"
            SET package_id = $1, user_id = $2, booked_date = $3, no_of_people = $4, is_confirm = $5, is_cancelled = $6, status = $7, description = $8, contact_no = $9, update_at = $10
            WHERE id = $11
            RETURNING *`;

        const values = [package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no, update_at, bookingId];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Booking not found or not modified.' });
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

// Delete request for booking
exports.deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.postId;
        const query = 'DELETE FROM public."PackageBooking" WHERE id = $1';
        const values = [bookingId];

        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Booking not found.' });
        }

        res.status(200).json({ msg: 'Booking deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};
