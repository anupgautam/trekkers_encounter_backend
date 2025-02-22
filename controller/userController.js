const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailService = require('../utils/mailUtils');
const client = require('../utils/db');

exports.SignUp = async (req, res) => {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        try {
            const existingUser = await client.query('SELECT * FROM "Users" WHERE email = $1', [req.body.email]);

            if (existingUser.rowCount > 0) {
                return res.status(400).json({ msg: 'Email already exists.' });
            }

            const token = crypto.randomBytes(20).toString('hex')
            const query = `INSERT INTO public."Users" (id, first_name, last_name, email, address, contact_no, password, verification_token, is_verified, is_admin)
                           VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
            const values = [
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                req.body.address,
                req.body.contact_no,
                hash,
                token,
                false,
                false,
            ];

            const user = await client.query(query, values);

            res.status(201).json({ msg: 'User Successfully Created.', resp: user.rows[0] });

            const verificationLink = `http://localhost:8888/user/verify?token=${token}`;
            const payload = {
                to: user.rows[0].email,
                title: 'Welcome to Himalayan Tours and Adventure!',
                message: `Dear sir/mam,
                
            Welcome to Himalayan Tours and Adventure Pvt. Ltd.! We are thrilled to have you join our community of adventure seekers.
            
            Here at Himalayan Tours and Adventure, we offer a wide range of exciting trekking and adventure experiences that will take you to the most breathtaking and remote corners of the Himalayas. Our team of experienced guides and support staff are dedicated to ensuring that your journey with us is not only safe but also filled with unforgettable memories.
            
            Your registration with us is a significant step toward embarking on incredible journeys, making new friends, and exploring the beauty of the Himalayas. We look forward to having you as part of our adventure family.
            
            To get started, please verify your email address by clicking the link below:
            <a href="${verificationLink}">Verify Your Email</a>
            
            Thank you for choosing Himalayan Tours and Adventure for your next adventure! If you have any questions or need assistance, don't hesitate to contact our support team at info@himalayantoursandadventure.com.
            
            See you on the trails!
            
            Best regards,
            The Himalayan Tours and Adventure Team`,
                link: `${verificationLink}`,
            };

            mailService.sendMail(payload);
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Server Error.', err });
        }
    });
};

exports.getUser = async (req, res) => {
    try {
        const isVerified = req.query.is_verified;
        if (isVerified !== 'true' && isVerified !== 'false') {
            return res.status(400).json({ msg: 'Invalid is_verified parameter. It must be true or false.' });
        }

        const query = 'SELECT * FROM "Users" WHERE is_verified = $1';
        const values = [isVerified];
        const results = await client.query(query, values);

        res.status(200).json(results.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const postId = req.params.postId;
        const updateFields = {};

        // Check if 'first_name' is provided and not null
        if (req.body.first_name !== undefined && req.body.first_name !== null) {
            updateFields.first_name = req.body.first_name;
        }

        // Add similar checks for other fields (last_name, address, contact_no, etc.)

        if (req.body.last_name !== undefined && req.body.last_name !== null) {
            updateFields.last_name = req.body.last_name;
        }
        if (req.body.address !== undefined && req.body.address !== null) {
            updateFields.address = req.body.address;
        }
        if (req.body.contact_no !== undefined && req.body.contact_no !== null) {
            updateFields.contact_no = req.body.contact_no;
        }
        if (req.body.is_verified !== undefined) {
            updateFields.is_verified = req.body.is_verified;
        }

        // If there are no fields to update, respond with an error
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ msg: 'No fields to update.' });
        }

        // Construct and execute the SQL query
        const query = `
            UPDATE public."Users"
            SET 
                first_name = COALESCE($1, first_name), 
                last_name = COALESCE($2, last_name), 
                address = COALESCE($3, address), 
                contact_no = COALESCE($4, contact_no), 
                is_verified = COALESCE($5, is_verified)
            WHERE id = $6
            RETURNING *`;
        const values = [
            updateFields.first_name,
            updateFields.last_name,
            updateFields.address,
            updateFields.contact_no,
            updateFields.is_verified,
            postId,
        ];

        const updatedUser = await client.query(query, values);

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.status(200).json(updatedUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const query = `
            UPDATE public."Users"
            SET is_admin = $1
            WHERE id = $2
            RETURNING *`;
        const values = [req.body.is_admin, req.params.postId];

        const updatedUser = await client.query(query, values);

        res.status(200).json(updatedUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const query = 'SELECT * FROM "Users" WHERE id = $1';
        const values = [req.params.id];

        const user = await client.query(query, values);

        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

exports.verify = async (req, res) => {
    try {
        const token = req.query.token;

        const query = `
            UPDATE public."Users"
            SET is_verified = true
            WHERE verification_token = $1
            RETURNING *`;
        const values = [token];

        const user = await client.query(query, values);

        if (user.rowCount === 0) {
            return res.status(400).json({ msg: 'Invalid or expired token.' });
        }

        res.status(200).json({ msg: 'Email verified successfully.' });
    } catch (err) {
        console.error('Error updating Users:', err);
        res.status(500).json({ msg: 'Server Error.', err });
    }
};

exports.login = async (req, res) => {
    try {
        const query = 'SELECT * FROM "Users" WHERE email = $1';
        const values = [req.body.email];

        const user = await client.query(query, values);

        if (user.rowCount === 0) {
            return res.status(400).json({ msg: 'Your email does not exist.' });
        }

        if (!user.rows[0].is_verified) {
            return res.status(400).json({ msg: 'User is not verified. Please contact the admin.' });
        }

        bcrypt.compare(req.body.password, user.rows[0].password, (err, result) => {
            if (err || !result) {
                return res.status(400).json({ msg: 'Password does not match' });
            }

            const access = jwt.sign(user.rows[0], 'access', { expiresIn: '10m' });
            const refresh = jwt.sign(user.rows[0], 'refresh', { expiresIn: '12d' });

            res.status(200).json({
                email: user.rows[0].email,
                id: user.rows[0].id,
                is_admin: user.rows[0].is_admin,
                tokens: {
                    access,
                    refresh,
                },
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

const resetTokens = new Map();

exports.checkEmailExistsAndSendLink = async (req, res) => {
    const { email } = req.body;
    try {
        const query = 'SELECT * FROM "Users" WHERE email = $1';
        const values = [email];
        const user = await client.query(query, values);
        if (user.rowCount === 0) {
            return res.status(404).json({ msg: 'Email not found.' });
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        resetTokens.set(email, resetToken);
        const resetLink = `http://localhost:3000/forgotpassword/newpassword?token=${resetToken}`;

        const payload = {
            to: email,
            title: 'Password Reset Request',
            message: `<h1>Dear sir/mam,</h1>
        
       <p> We received a request to reset your password for your Himalayan Tours and Adventure Pvt. Ltd. account.
        
        To reset your password, please click the link below:
        <a href="${resetLink}">Reset Your Password</a>
        
        If you didn't make this request, you can safely ignore this email. Your password will remain unchanged.
        
        If you have any questions or need assistance, please contact our support team at info@himalayantoursandadventure.com.<p>
        
        <h5>Best regards</h4>,
        <h5>The Himalayan Tours and Adventure Team</h4>`,
            link: resetLink,
        };
        mailService.sendMail(payload);
        return res.status(200).json({ msg: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Error sending reset link:', error);
        return res.status(500).json({ msg: 'Server Error.', error });
    }
};


//reset password
exports.resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    try {
        const saltRounds = 10;
        if (!newPassword) {
            return res.status(400).json({ msg: 'New password is missing or invalid.' });
        }
        const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
        const query = `
            UPDATE public."Users"
            SET password = $1
            RETURNING *`;

        const values = [hashedPassword];
        const updatedUsers = await client.query(query, values);
        if (updatedUsers.rowCount === 0) {
            return res.status(400).json({ msg: 'Password update failed.' });
        }

        res.status(200).json({ msg: 'Password successfully updated for all applicable users.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ msg: 'Server Error.', error });
    }
};

async function getUserByIdData(userId) {
    try {
        const user = await client.oneOrNone('SELECT * FROM "Users" WHERE id = $1', userId);
        return user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        return null;
    }
}


//change password api
exports.changePassword = async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    try {
        // Check the current password by retrieving the user's hashed password from the database
        const getPasswordQuery = 'SELECT password FROM "Users" WHERE id = $1';
        const result = await client.query(getPasswordQuery, [userId]);

        if (result.rowCount === 1) {
            const storedHashedPassword = result.rows[0].password;

            // Compare the provided current password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(currentPassword, storedHashedPassword);

            if (isPasswordValid) {
                // Hash the new password
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                // Update the user's password in the database
                const updateQuery = 'UPDATE "Users" SET password = $1 WHERE id = $2';
                await client.query(updateQuery, [hashedPassword, userId]);

                res.status(200).json({ message: 'Password updated successfully.' });
            } else {
                res.status(400).json({ message: 'Current password is incorrect.' });
            }
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error.' });
    }
};