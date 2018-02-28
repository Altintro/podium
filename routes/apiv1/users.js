'use_strict'

var express = require('express');
var router = express.Router();
const User = require('../../models/User')
var verifyToken = require('./auth/verifyToken')

// GET users  
router.get('/',verifyToken, (req, res, next) => {

  const name = req.query.name
  const username = req.query.username

  const limit = parseInt(req.query.limit)
  const skip = parseInt(req.query.skip)
  const fields = req.query.fields
  const sort = req.query.sort

  const filter = {}

  if(name) { filter.name = { $regex: '^'+ name, $options: 'i' }}
  if(username){ filter.username = { $regex: '^'+username, $options: 'i' }}

  User.list(filter,limit,skip,fields,sort,
    (err, users) => {
    if(err) {
      next(err)
      return
    }
    res.json({success: true, result: users})
  })
});

// Delete User

router.delete('/', verifyToken, (req,res,next) => {
    User.deleteOne({name: req.body.name}, (err, user) => {
      if(err) {
          res.json({ error: 'Error deleting user' + err,
          email: req.body.email})
          return
      }
      res.json({deleted: true})
    })
})

module.exports = router;
