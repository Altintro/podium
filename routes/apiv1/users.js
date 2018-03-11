'use_strict'

var express = require('express');
var router = express.Router();
var userController = require('../../controllers/userController')
var userAccountController = require('../../controllers/userAccountController')
var authController = require('../../controllers/authController')

// Auth
router.post('/register', userAccountController.register)
router.post('/login',userAccountController.login )

// Others
router.use(authController.verifyToken);

router.get('/', userController.getUsers)
router.get('/me', userController.me)
router.delete('/:id', userController.deleteUser)

module.exports = router;
