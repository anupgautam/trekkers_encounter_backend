const client = require('../utils/db');

// Posting the Booking
exports.postBooking = async (req, res) => {
    let connection;
    try {
        // Extract data from the request body
        const { package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no } = req.body;

        // Validate required fields
        if (!package_id || !user_id || !booked_date || !no_of_people) {
            return res.status(400).json({ msg: 'Missing required fields: package_id, user_id, booked_date, and no_of_people are required.' });
        }

        // Validate the date
        const bookingDate = new Date(booked_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (bookingDate < today) {
            return res.status(400).json({ msg: 'Booking date must be today or a future date.' });
        }

        connection = await client.getConnection();
        const query = `
            INSERT INTO PackageBooking (package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [package_id, user_id, booked_date, no_of_people, is_confirm || 0, is_cancelled || 0, status || 'pending', description || null, contact_no || null];

        const [result] = await connection.query(query, values);
        const newBooking = { id: result.insertId, package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no };

        res.status(201).json({ msg: 'Booking Successfully Added.', resp: newBooking });
    } catch (error) {
        console.error("Error in postBooking:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for booking
exports.getBooking = async (req, res) => {
    let connection;
    try {
        const { status } = req.query;
        connection = await client.getConnection();

        const query = `
            SELECT 
                pb.id AS booking_id,
                pb.user_id,
                pb.booked_date,
                pb.no_of_people,
                pb.description AS booking_description,
                pb.contact_no,
                pb.is_confirm,
                pb.is_cancelled,
                pb.status,
                pb.created_at AS booking_created_at,
                pb.updated_at AS booking_updated_at,

                p.id AS package_id,
                p.category_id,
                p.sub_category_id,
                p.sub_sub_category_id,
                p.language_id,
                p.title,
                p.short_description,
                p.description,
                p.duration,
                p.currency,
                p.price,
                p.package_image,
                p.overall_ratings,
                p.created_at AS package_created_at,
                p.updated_at AS package_updated_at,

                u.first_name,
                u.last_name,
                u.email,
                u.contact_no AS user_contact_no,
                u.address,
                u.password,
                u.is_verified,
                u.is_admin,
                u.verification_token,
                u.created_at AS user_created_at,
                u.updated_at AS user_updated_at

            FROM PackageBooking pb
            JOIN Package p ON pb.package_id = p.id
            JOIN Users u ON pb.user_id = u.id
            ${status ? 'WHERE pb.status = ?' : ''}
        `;
        const values = status ? [status] : [];

        const [results] = await connection.query(query, values);

        const formatted = results.map(row => ({
            id: row.booking_id,
            booked_date: row.booked_date,
            no_of_people: row.no_of_people,
            description: row.booking_description,
            contact_no: row.contact_no,
            is_confirm: row.is_confirm,
            is_cancelled: row.is_cancelled,
            status: row.status,
            created_at: row.booking_created_at,
            updated_at: row.booking_updated_at,

            user_id: {
                id: row.user_id,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                contact_no: row.user_contact_no,
                address: row.address,
                password: row.password,
                is_verified: row.is_verified,
                is_admin: row.is_admin,
                verification_token: row.verification_token,
                created_at: row.user_created_at,
                updated_at: row.user_updated_at,
            },

            package_id: {
                id: row.package_id,
                category_id: row.category_id,
                sub_category_id: row.sub_category_id,
                sub_sub_category_id: row.sub_sub_category_id,
                language_id: row.language_id,
                title: row.title,
                short_description: row.short_description,
                description: row.description,
                duration: row.duration,
                currency: row.currency,
                price: row.price,
                package_image: row.package_image,
                overall_ratings: row.overall_ratings,
                created_at: row.package_created_at,
                updated_at: row.package_updated_at,
            }
        }));

        res.status(200).json(formatted);
    } catch (error) {
        console.error("Error in getBooking:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Get request for booking by ID
exports.getBookingById = async (req, res) => {
    let connection;
    try {
        const bookingId = req.params.postId;
        connection = await client.getConnection();
        const query = 'SELECT * FROM PackageBooking WHERE id = ?';
        const values = [bookingId];

        const [results] = await connection.query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'Booking not found.' });
        }

        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error in getBookingById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Updating a Booking
exports.updateBooking = async (req, res) => {
    let connection;
    try {
        const id = req.params.postId;
        const { is_confirm, status } = req.body;

        // Validate required fields
        if (is_confirm === undefined && status === undefined) {
            return res.status(400).json({ msg: 'Must provide at least is_confirm or status to update.' });
        }

        // Validate status values if provided
        const allowedStatuses = ["pending", "approved", "cancelled"];
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid status value. Allowed values are: pending, approved, cancelled.' });
        }

        connection = await client.getConnection();

        // Build SET clause dynamically
        const setClauses = [];
        const values = [];

        if (is_confirm !== undefined) {
            setClauses.push('is_confirm = ?');
            values.push(is_confirm ? 1 : 0);
        }

        if (status) {
            setClauses.push('status = ?');
            values.push(status);
        }

        values.push(id);

        const query = `
            UPDATE PackageBooking 
            SET ${setClauses.join(', ')} 
            WHERE id = ?
        `;

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Booking not found.' });
        }

        res.status(200).json({
            msg: 'Booking status successfully updated.',
            resp: {
                id,
                ...(is_confirm !== undefined && { is_confirm: is_confirm ? 1 : 0 }),
                ...(status && { status })
            }
        });
    } catch (error) {
        console.error("Error in updateBooking:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Delete request for booking
exports.deleteBooking = async (req, res) => {
    let connection;
    try {
        const bookingId = req.params.postId;
        connection = await client.getConnection();
        const query = 'DELETE FROM PackageBooking WHERE id = ?';
        const values = [bookingId];

        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Booking not found.' });
        }

        res.status(200).json({ msg: 'Booking deleted successfully.' });
    } catch (error) {
        console.error("Error in deleteBooking:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};