'use_strict'

var express = require('express');
var router = express.Router();
const User = require('../../models/User')
var verifyToken = require('./auth/verifyToken')
var userController = require('../../controllers/userController')
 
router.get('/',verifyToken, userController.get)

// Delete
router.delete('/:id', verifyToken, userController.delete)

module.exports = router;
