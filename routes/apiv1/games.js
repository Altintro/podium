'use_strict'

var express = require('express')
var router = require('express-promise-router')()
var gameController = require('../../controllers/gameController')
var authController = require('../../controllers/authController')



router.get('/',gameController.getGames)
router.get('/:id',gameController.getGame)

router.use(authController.verifyToken)

router.post('/',gameController.postGame)
router.post('/signup/:id',gameController.signUpGame)
router.delete('/:id',gameController.deleteGame)

module.exports = router