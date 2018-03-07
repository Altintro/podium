'use_strict'

const User = require('../models/User')

exports.get = (req, res, next) => {

    const name = req.query.name
    const alias = req.query.alias
  
    const limit = parseInt(req.query.limit)
    const skip = parseInt(req.query.skip)
    const fields = req.query.fields
    const sort = req.query.sort
  
    const filter = {}
  
    if(name) { filter.name = { $regex: '^'+ name, $options: 'i' }}
    if(alias){ filter.alias = { $regex: '^'+alias, $options: 'i' }}
    filter.pass = '0'

    console.log(filter)
  
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