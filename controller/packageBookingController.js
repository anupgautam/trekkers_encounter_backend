const client = require('../utils/db'); // Assuming MySQL client is set up

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
            INSERT INTO PackageBooking (package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no];

        const [result] = await client.execute(query, values);

        res.status(201).json({ msg: 'Booking Successfully Added.', resp: result });
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
        const query = status ? `SELECT * FROM PackageBooking WHERE status = ?` : `SELECT * FROM PackageBooking`;
        const values = status ? [status] : [];

        const [result] = await client.execute(query, values);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};


// Get request for booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.postId;
        const query = 'SELECT * FROM PackageBooking WHERE id = ?';
        const values = [bookingId];

        const [result] = await client.execute(query, values);

        if (result.length === 0) {
            return res.status(404).json({ msg: 'Booking not found.' });
        }

        res.status(200).json(result[0]);
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
            UPDATE PackageBooking
            SET package_id = ?, user_id = ?, booked_date = ?, no_of_people = ?, is_confirm = ?, is_cancelled = ?, status = ?, description = ?, contact_no = ?, update_at = ?
            WHERE id = ?
        `;

        const values = [package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no, update_at, bookingId];

        const [result] = await client.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Booking not found or not modified.' });
        }

        res.status(200).json({ msg: 'Booking Updated Successfully.', resp: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};


// Delete request for booking
exports.deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.postId;
        const query = 'DELETE FROM PackageBooking WHERE id = ?';
        const values = [bookingId];

        const [result] = await client.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Booking not found.' });
        }

        res.status(200).json({ msg: 'Booking deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

