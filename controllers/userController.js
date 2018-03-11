'use_strict'

const mapBasicUser = require('./userAccountController').mapBasicUser
const User = require('../models/User')

exports.getUsers = (req, res, next) => {

    const limit = parseInt(req.query.limit)
    const fields = req.query.fields
    const sort = req.query.sort 
  
    const filter = {}
    const name = req.query.name
    const alias = req.query.alias
    if(name) { filter.name = { $regex: '^'+ name, $options: 'i' }}
    if(alias){ filter.alias = { $regex: '^'+ alias, $options: 'i' }}

    User.find(filter).select('-pass').limit(limit).sort(sort).exec().then((users) => {
            users = users.map(mapBasicUser)
            return res.json({result: users})
        }).catch((err) => {
            return next(err) 
        })
}

exports.getUser = (req, res, next) => {
    // With games in query as true, should populate all games properties
    let gamesPlaying = req.query.games ? 'gamesPlaying' : ''
    User.findById(req.params.id).select('-pwd').populate(gamesPlaying).exec().then((user) => {
        return res.json({user})
    }).catch((err) => {
        return next(err)
    })
}

exports.deleteUser =  (req,res,next) => {
    var query = {_id: req.params.id}
    User.deleteOne(query).exec().then((user) => {
      return res.json({deleted: true})
    }).catch((err) => {
      return next(err)
    })
}