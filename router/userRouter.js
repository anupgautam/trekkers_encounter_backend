var express = require('express');
var router = express.Router();
var userController = require('../controller/userController');

//user routing
router.post('/signup/', userController.SignUp);
router.post('/login/', userController.login);
router.get('/verify', userController.verify);
router.get('/user', userController.getUser);
router.get('/user/:id', userController.getUserById);
router.put('/user/:postId', userController.updateUser);
router.patch('/user/admin/user/admin/admin/:postId', userController.updateAdmin)
router.post('/forgot/password/', userController.checkEmailExistsAndSendLink);
router.post('/change/password/', userController.resetPassword);
router.post('/change/new/password', userController.changePassword);

module.exports = router;