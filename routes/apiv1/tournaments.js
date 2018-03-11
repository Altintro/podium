'use_strict'

var express = require('express')
var router = express.Router()
const Tournament = require('../../models/Tournament')
var tournamentController = require('../../controllers/tournamentController')
var authController = require('../../controllers/authController')

router.use(authController.verifyToken)

router.get('/',tournamentController.getTournaments)
router.get('/:id', tournamentController.getTournament)
router.post('/', tournamentController.postTournament)
router.post('/signup/:id', tournamentController.signUpTournament) 
router.delete('/:id',tournamentController.deleteTournament)


module.exports = router