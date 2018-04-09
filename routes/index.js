'use_strict'

var express = require('express');
var router = express.Router();
var fs = require('fs')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Podium' });
});

router.get('/apple-app-site-association', (req, res , send) => {
  var aasa = fs.readFileSync(__dirname + '/../apple-app-site-association')
  res.status(200).send(aasa)
})

module.exports = router;
