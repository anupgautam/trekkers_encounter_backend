const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailService = require('../utils/mailUtils');
const client = require('../utils/db');


exports.SignUp = async (req, res) => {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        try {
            // Check if email already exists
            client.execute('SELECT * FROM Users WHERE email = ?', [req.body.email], (err, results) => {
                if (err) {
                    return res.status(500).json({ msg: 'Server Error.', err });
                }
                if (results.length > 0) {
                    return res.status(400).json({ msg: 'Email already exists.' });
                }

                // Generate verification token
                const token = crypto.randomBytes(20).toString('hex');
                const query = `INSERT INTO Users (first_name, last_name, email, address, contact_no, password, verification_token, is_verified, is_admin) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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

                client.execute(query, values, (err, results) => {
                    if (err) {
                        return res.status(500).json({ msg: 'Error creating user.', err });
                    }

                    const user = results[0]; // Assuming the result contains the inserted user

                    res.status(201).json({ msg: 'User Successfully Created.', resp: user });

                    const verificationLink = `http://localhost:8888/user/verify?token=${token}`;
                    const payload = {
                        to: user.email,
                        title: 'Welcome to Himalayan Tours and Adventure!',
                        message: `Dear sir/mam,
                                    Welcome to Himalayan Tours and Adventure Pvt. Ltd.! We are thrilled to have you join our community of adventure seekers.
                                    
                                    Please verify your email by clicking the link below:
                                    <a href="${verificationLink}">Verify Your Email</a>`,
                        link: `${verificationLink}`,
                    };

                    mailService.sendMail(payload);
                });
            });
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

        client.execute('SELECT * FROM Users WHERE is_verified = ?', [isVerified], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Server Error.', err });
            }

            res.status(200).json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const postId = req.params.postId;
        const updateFields = {};

        if (req.body.first_name !== undefined) updateFields.first_name = req.body.first_name;
        if (req.body.last_name !== undefined) updateFields.last_name = req.body.last_name;
        if (req.body.address !== undefined) updateFields.address = req.body.address;
        if (req.body.contact_no !== undefined) updateFields.contact_no = req.body.contact_no;
        if (req.body.is_verified !== undefined) updateFields.is_verified = req.body.is_verified;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ msg: 'No fields to update.' });
        }

        const setString = Object.keys(updateFields)
            .map(key => `${key} = ?`)
            .join(', ');

        const values = [...Object.values(updateFields), postId];

        const query = `UPDATE Users SET ${setString} WHERE id = ?`;

        client.execute(query, values, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Server Error.', err });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ msg: 'User not found.' });
            }

            res.status(200).json(results);
        });
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

        const updatedUser = await client.execute(query, values);

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

        const user = await client.execute(query, values);

        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error.', error });
    }
};

exports.verify = async (req, res) => {
    try {
        const token = req.query.token;

        client.execute('UPDATE Users SET is_verified = true WHERE verification_token = ?', [token], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Server Error.', err });
            }

            if (results.affectedRows === 0) {
                return res.status(400).json({ msg: 'Invalid or expired token.' });
            }

            res.status(200).json({ msg: 'Email verified successfully.' });
        });
    } catch (err) {
        console.error('Error updating Users:', err);
        res.status(500).json({ msg: 'Server Error.', err });
    }
};


exports.login = async (req, res) => {
    try {
        client.execute('SELECT * FROM Users WHERE email = ?', [req.body.email], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Server Error.', error: err });
            }

            if (results.length === 0) {
                return res.status(400).json({ msg: 'Your email does not exist.' });
            }

            const user = results[0];

            if (!user.is_verified) {
                return res.status(400).json({ msg: 'User is not verified. Please contact the admin.' });
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err || !result) {
                    return res.status(400).json({ msg: 'Password does not match' });
                }

                const access = jwt.sign(user, 'access', { expiresIn: '10m' });
                const refresh = jwt.sign(user, 'refresh', { expiresIn: '12d' });

                res.status(200).json({
                    email: user.email,
                    id: user.id,
                    is_admin: user.is_admin,
                    tokens: {
                        access,
                        refresh,
                    },
                });
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
        const user = await client.execute(query, values);
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
        const updatedUsers = await client.execute(query, values);
        if (updatedUsers.rowCount === 0) {
            return res.status(400).json({ msg: 'Password update failed.' });
        }

        res.status(200).json({ msg: 'Password successfully updated for all applicable users.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ msg: 'Server Error.', error });
    }
};



//change password api
exports.changePassword = async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    try {
        client.execute('SELECT password FROM Users WHERE id = ?', [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Server Error.', error: err });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const storedHashedPassword = results[0].password;

            bcrypt.compare(currentPassword, storedHashedPassword, async (err, isPasswordValid) => {
                if (err || !isPasswordValid) {
                    return res.status(400).json({ message: 'Current password is incorrect.' });
                }

                const hashedPassword = await bcrypt.hash(newPassword, 10);

                client.execute('UPDATE Users SET password = ? WHERE id = ?', [hashedPassword, userId], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Error updating password.', err });
                    }

                    res.status(200).json({ message: 'Password updated successfully.' });
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error.' });
    }
};
