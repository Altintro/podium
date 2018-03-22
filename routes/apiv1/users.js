'use_strict'

var express = require('express');
var router = require('express-promise-router')()
var userController = require('../../controllers/userController')
var userAccountController = require('../../controllers/userAccountController')
var authController = require('../../controllers/authController') 

// Auth
router.post('/register', userAccountController.register)
router.post('/login',userAccountController.login )
router.post('/google', userAccountController.google)
router.post('/checkEmail', userAccountController.checkEmail)
router.post('/checkAlias', userAccountController.checkAlias)

// Others

// No token required
router.get('/', userController.getUsers)
router.get('/:id', userController.getUser)

// Token required
router.use(authController.verifyToken);
router.delete('/:id', userController.deleteUser)



module.exports = router;
