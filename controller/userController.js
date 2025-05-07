const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailService = require('../utils/mailUtils');
const client = require('../utils/db');

const resetTokens = new Map();

exports.SignUp = async (req, res) => {
    let connection;
    try {
        const { first_name, last_name, email, address, contact_no, password } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !email || !address || !contact_no || !password) {
            return res.status(400).json({ msg: 'Missing required fields: first_name, last_name, email, address, contact_no, and password are required.' });
        }

        connection = await client.getConnection();

        // Check if email already exists
        const [existingResult] = await connection.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (existingResult.length > 0) {
            return res.status(400).json({ msg: 'Email already exists.' });
        }

        // Generate verification token
        const token = crypto.randomBytes(20).toString('hex');
        const hash = await bcrypt.hash(password, 10);
        const query = `INSERT INTO Users (first_name, last_name, email, address, contact_no, password, verification_token, is_verified, is_admin) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [first_name, last_name, email, address, contact_no, hash, token, false, false];

        const [result] = await connection.query(query, values);
        const userId = result.insertId;

        const [userResult] = await connection.query('SELECT * FROM Users WHERE id = ?', [userId]);
        const user = userResult[0];

        res.status(201).json({ msg: 'User Successfully Created.', resp: user });

        const verificationLink = `https://api.trekkersencounter.com/user/verify?token=${token}`;
        const payload = {
            to: user.email,
            title: 'Welcome to Trekkers Encounter Nepal!',
            message: `Dear sir/mam,
                      Welcome to Trekkers Encounter Nepal Pvt. Ltd.! We are thrilled to have you join our community of adventure seekers.
                      
                      Please verify your email by clicking the link below:
                      <a href="${verificationLink}">Verify Your Email</a>`,
            link: verificationLink,
        };

        mailService.sendMail(payload);
    } catch (error) {
        console.error("Error in SignUp:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.getUser = async (req, res) => {
    let connection;
    try {
        const isVerified = req.query.is_verified;
        if (isVerified !== 'true' && isVerified !== 'false') {
            return res.status(400).json({ msg: 'Invalid is_verified parameter. It must be true or false.' });
        }

        connection = await client.getConnection();
        const [results] = await connection.query('SELECT * FROM Users WHERE is_verified = ?', [isVerified === 'true']);

        res.status(200).json(results);
    } catch (error) {
        console.error("Error in getUser:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.updateUser = async (req, res) => {
    let connection;
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

        connection = await client.getConnection();
        const setString = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateFields), postId];
        const query = `UPDATE Users SET ${setString} WHERE id = ?`;

        const [results] = await connection.query(query, values);

        if (results.affectedRows === 0) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.status(200).json({ msg: 'User updated successfully.', resp: results });
    } catch (error) {
        console.error("Error in updateUser:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.updateAdmin = async (req, res) => {
    let connection;
    try {
        const query = 'UPDATE Users SET is_admin = ? WHERE id = ?';
        const values = [req.body.is_admin, req.params.postId];

        connection = await client.getConnection();
        const [result] = await connection.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        const [userResult] = await connection.query('SELECT * FROM Users WHERE id = ?', [req.params.postId]);
        res.status(200).json({ msg: 'Admin status updated successfully.', resp: userResult[0] });
    } catch (error) {
        console.error("Error in updateAdmin:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.getUserById = async (req, res) => {
    let connection;
    try {
        const query = 'SELECT * FROM Users WHERE id = ?';
        const values = [req.params.id];

        connection = await client.getConnection();
        const [result] = await connection.query(query, values);

        if (result.length === 0) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error in getUserById:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.verify = async (req, res) => {
    let connection;
    try {
        const token = req.query.token;

        connection = await client.getConnection();
        const [results] = await connection.query('UPDATE Users SET is_verified = true WHERE verification_token = ?', [token]);

        if (results.affectedRows === 0) {
            return res.status(400).json({ msg: 'Invalid or expired token.' });
        }

        res.status(200).json({ msg: 'Email verified successfully.' });
    } catch (error) {
        console.error("Error in verify:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.login = async (req, res) => {
    let connection;
    try {
        connection = await client.getConnection();
        const [results] = await connection.query('SELECT * FROM Users WHERE email = ?', [req.body.email]);

        if (results.length === 0) {
            return res.status(400).json({ msg: 'Your email does not exist.' });
        }

        const user = results[0];

        if (!user.is_verified) {
            return res.status(400).json({ msg: 'User is not verified. Please contact the admin.' });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Password does not match.' });
        }

        const access = jwt.sign(user, 'access', { expiresIn: '10m' });
        const refresh = jwt.sign(user, 'refresh', { expiresIn: '12d' });

        res.status(200).json({
            email: user.email,
            id: user.id,
            is_admin: user.is_admin === 1,
            tokens: { access, refresh },
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.checkEmailExistsAndSendLink = async (req, res) => {
    let connection;
    try {
        const { email } = req.body;

        connection = await client.getConnection();
        const [userResult] = await connection.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (userResult.length === 0) {
            return res.status(404).json({ msg: 'Email not found.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        resetTokens.set(email, resetToken);
        const resetLink = `https://trekkersencounter.com/forgotpassword/newpassword?token=${resetToken}`;

        const payload = {
            to: email,
            title: 'Password Reset Request',
            message: `<h1>Dear sir/mam,</h1>
        
       <p> We received a request to reset your password for your Trekkers Encounter Nepal Pvt. Ltd. account.
        
        To reset your password, please click the link below:
        <a href="${resetLink}">Reset Your Password</a>
        
        If you didn't make this request, you can safely ignore this email. Your password will remain unchanged.
        
        If you have any questions or need assistance, please contact our support team at info@trekkersencounter.com.<p>
        
        <h5>Best regards</h4>,
        <h5>The Trekkers Encounter Nepal Team</h4>`,
            link: resetLink,
        };

        mailService.sendMail(payload);
        res.status(200).json({ msg: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error("Error in checkEmailExistsAndSendLink:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.resetPassword = async (req, res) => {
    let connection;
    try {
        const { newPassword, token } = req.body;

        // Validate required fields
        if (!newPassword || !token) {
            return res.status(400).json({ msg: 'Missing required fields: newPassword and token are required.' });
        }

        connection = await client.getConnection();
        const [userResult] = await connection.query('SELECT email FROM Users WHERE verification_token = ?', [token]);

        if (userResult.length === 0) {
            return res.status(400).json({ msg: 'Invalid or expired token.' });
        }

        const email = userResult[0].email;
        if (!resetTokens.has(email) || resetTokens.get(email) !== token) {
            return res.status(400).json({ msg: 'Invalid token.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const query = 'UPDATE Users SET password = ?, verification_token = NULL WHERE email = ?';
        const [result] = await connection.query(query, [hashedPassword, email]);

        if (result.affectedRows === 0) {
            return res.status(500).json({ msg: 'Password update failed.' });
        }

        resetTokens.delete(email);
        res.status(200).json({ msg: 'Password successfully updated.', resp: { email } });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.changePassword = async (req, res) => {
    let connection;
    try {
        const { userId, currentPassword, newPassword } = req.body;

        // Validate required fields
        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ msg: 'Missing required fields: userId, currentPassword, and newPassword are required.' });
        }

        connection = await client.getConnection();
        const [results] = await connection.query('SELECT password FROM Users WHERE id = ?', [userId]);

        if (results.length === 0) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        const storedHashedPassword = results[0].password;
        const isMatch = await bcrypt.compare(currentPassword, storedHashedPassword);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [updateResult] = await connection.query('UPDATE Users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        if (updateResult.affectedRows === 0) {
            return res.status(500).json({ msg: 'Error updating password.' });
        }

        res.status(200).json({ msg: 'Password updated successfully.' });
    } catch (error) {
        console.error("Error in changePassword:", error);
        res.status(500).json({ msg: 'Server Error.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};