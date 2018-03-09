'use_strict'

var express = require('express');
var router = express.Router();
var verifyToken = require('./auth/verifyToken')
var userController = require('../../controllers/userController')
 
router.get('/',verifyToken, userController.getUsers)

router.delete('/:id', verifyToken, userController.deleteUser)

module.exports = router;
