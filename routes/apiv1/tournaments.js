'use_strict'

var express = require('express')
var router = express.Router()
const Tournament = require('../../models/Tournament')
var verifyToken = require('./auth/verifyToken')
var tournamentController = require('../../controllers/tournamentController')

router.get('/',verifyToken,tournamentController.getTournaments)

router.post('/',verifyToken, tournamentController.postTournament)

router.post('/signup/:id',verifyToken, tournamentController.signUpTournament) 

router.delete('/:id',tournamentController.deleteTournament)


module.exports = router