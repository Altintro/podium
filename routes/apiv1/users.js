'use_strict'

var express = require('express');
var router = require('express-promise-router')()
var userController = require('../../controllers/userController')
var userAccountController = require('../../controllers/userAccountController')
var authRequired = require('../../controllers/authController').authRequired 
var authRefreshRequired = require('../../controllers/authController').authRefreshRequired

router.post('/login',userAccountController.login )
router.post('/googleConnect', userAccountController.google)
router.post('/facebookConnect', userAccountController.facebook)
router.post('/emailConnect',userAccountController.email)
router.post('/emailRegister',userAccountController.emailRegister)
router.post('/checkEmail', userAccountController.checkEmail)
router.post('/checkAlias', userAccountController.checkAlias)
router.get('/refreshToken', authRefreshRequired, userAccountController.refreshToken)

router.get('/', userController.getUsers)
router.get('/:id/detail', userController.getUser)

router.use(authRequired);
router.post('/socialRegister', userAccountController.socialRegisterUserUpdate)
router.get('/tokens', userAccountController.tokens)
router.delete('/:id', userController.deleteUser)




module.exports = router;
