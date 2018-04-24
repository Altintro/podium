'use_strict'

var express = require('express')
var router = require('express-promise-router')()
var gameController = require('../../controllers/gameController')
var authRequired = require('../../controllers/authController').authRequired

router.get('/', gameController.getGames)
router.get('/:id/detail',gameController.getGame)

router.use(authRequired)
router.post('/',gameController.createGame)
router.post('/:id/join',gameController.joinGame)
router.delete('/:id',gameController.deleteGame)

module.exports = router