'use_strict'

var express = require('express')
var router = require('express-promise-router')()
const Tournament = require('../../models/Tournament')
var tournamentController = require('../../controllers/tournamentController')
var authRequired = require('../../controllers/authController').authRequired

router.get('/',tournamentController.getTournaments)
router.get('/:id/detail', tournamentController.getTournament)

router.use(authRequired)
router.post('/', tournamentController.postTournament)
router.post('/:id/signup', tournamentController.signUpTournament) 
router.delete('/:id',tournamentController.deleteTournament)


module.exports = router