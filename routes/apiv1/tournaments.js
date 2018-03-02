'use_strict'

var express = require('express')
var router = express.Router()
const Tournament = require('../../models/Tournament')
var verifyToken = require('./auth/verifyToken')
var tournamentController = require('../../controllers/tournamentController')

// Get Tournaments
router.get('/',verifyToken,tournamentController.get)

// Post Tournaments
router.post('/',verifyToken, tournamentController.post)

//Sign up to tournament
router.post('/:id',verifyToken, tournamentController.signup)

// Delete
router.delete('/:id',tournamentController.delete)


module.exports = router