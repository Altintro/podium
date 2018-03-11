'use_strict'

var express = require('express')
var router = express.Router()
var gameController = require('../../controllers/gameController')
var authController = require('../../controllers/authController')

router.use(authController.verifyToken)

router.get('/',gameController.getGames)
router.get('/:id',gameController.getGame)
router.post('/',gameController.postGame)
router.post('/signup/:id',gameController.signUpGame)
router.delete('/:id',gameController.deleteGame)

module.exports = router