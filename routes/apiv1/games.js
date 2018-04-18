'use_strict'

var express = require('express')
var router = require('express-promise-router')()
var gameController = require('../../controllers/gameController')
var authRequired = require('../../controllers/authController').authRequired

router.get('/', gameController.getGames)
router.get('/:id/detail',gameController.getGame)

router.use(authRequired)
router.post('/',gameController.postGame)
router.post('/:id/signup',gameController.signUpGame)
router.delete('/:id',gameController.deleteGame)

module.exports = router