'use_strict'

const User = require('../models/User')

exports.get = (req, res, next) => {

    const name = req.query.name
    const userName = req.query.userName
  
    const limit = parseInt(req.query.limit)
    const skip = parseInt(req.query.skip)
    const fields = req.query.fields
    const sort = req.query.sort
  
    const filter = {}
  
    if(name) { filter.name = { $regex: '^'+ name, $options: 'i' }}
    if(userName){ filter.userName = { $regex: '^'+userName, $options: 'i' }}
  
    User.list(filter,limit,skip,fields,sort,
      (err, users) => {
      if(err) {
        next(err)
        return
      }
      res.json({success: true, result: users})
    })
  }

exports.delete =  (req,res,next) => {
    User.deleteOne({_id: req.params.id}, (err, user) => {
      if(err) {
          res.json({ error: 'Error deleting user' + err,
          email: req.body.email})
          return
      }
      res.json({deleted: true})
    })
}