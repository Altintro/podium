'use_strict'

var express = require('express');
var router = require('express-promise-router')()
var userController = require('../../controllers/userController')
var userAccountController = require('../../controllers/userAccountController')
var authRequired = require('../../controllers/authController').authRequired 

router.post('/register', userAccountController.register)
router.post('/login',userAccountController.login )
router.post('/google', userAccountController.google)
router.post('/email',userAccountController.email)
router.post('/emailRegister',userAccountController.emailRegister)
router.post('/checkEmail', userAccountController.checkEmail)
router.post('/checkAlias', userAccountController.checkAlias)
router.get('/', userController.getUsers)
router.get('/detail/:id', userController.getUser)

router.use(authRequired);
router.get('/me', userAccountController.me)
router.delete('/:id', userController.deleteUser)



module.exports = router;
