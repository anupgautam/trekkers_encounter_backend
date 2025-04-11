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
            INSERT INTO PackageBooking (package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [package_id, user_id, booked_date, no_of_people, is_confirm, is_cancelled, status, description, contact_no];

        // Correctly handle the result of client.execute
        const result = await client.execute(query, values);

        // Since it's an INSERT query, you can check the `insertId` for the inserted record.
        res.status(201).json({ msg: 'Booking Successfully Added.', resp: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};


// Get request for booking
exports.getBooking = async (req, res) => {
    try {
        const { status } = req.query;

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

        client.query(query, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ msg: 'Server Error.', error: error.message });
            }

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
        });
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



// Updating a Booking
exports.updateBooking = async (req, res) => {
    try {
        const id = req.params.postId;
        const { is_confirm, status } = req.body;

        // Validate required fields
        if (is_confirm === undefined && status === undefined) {
            return res.status(400).json({ msg: 'Must provide at least is_confirm or status to update.' });
        }

        // Validate status values if needed
        const allowedStatuses = ["pending", "approved", "cancelled"];
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid status value.' });
        }

        // Build SET clause dynamically
        const setClauses = [];
        const values = [];

        if (is_confirm !== undefined) {
            setClauses.push('is_confirm = ?');
            values.push(is_confirm ? 1 : 0); // Convert true/false to 1/0
        }

        if (status) {
            setClauses.push('status = ?');
            values.push(status);
        }

        // Add booking ID at the end
        values.push(id);

        const query = `
            UPDATE PackageBooking 
            SET ${setClauses.join(', ')} 
            WHERE id = ?
        `;

        // Execute with callback-based mysql2
        const result = await new Promise((resolve, reject) => {
            client.execute(query, values, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Booking not found.' });
        }

        res.status(200).json({
            msg: 'Booking status successfully updated.',
            updatedFields: {
                ...(is_confirm !== undefined && { is_confirm: is_confirm ? 1 : 0 }),
                ...(status && { status })
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
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

