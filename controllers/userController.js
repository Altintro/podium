'use_strict'

const mapBasicUser = require('./userAccountController').mapBasicUser
const User = require('../models/User')

exports.getUsers = async (req, res, next) => {

    const limit = parseInt(req.query.limit)
    const fields = req.query.fields
    const sort = req.query.sort 
  
    const filter = {}
    const name = req.query.name
    const alias = req.query.alias
    if(name) { filter.name = { $regex: '^'+ name, $options: 'i' }}
    if(alias){ filter.alias = { $regex: '^'+ alias, $options: 'i' }}

    var users = await User.find(filter).select('-pass').limit(limit).sort(sort).exec()
    users = users.map(mapBasicUser)
    return res.status(200).json({result: users})
}

exports.getUser = async (req, res, next) => {

    // With games in query as true, should populate all games properties
    let gamesPlaying = req.query.games ? 'gamesPlaying' : ''
    const user = await User.findById(req.params.id).select('-pwd').populate(gamesPlaying).exec()
    return res.status(200).json({ result: user })
}

exports.deleteUser = async (req,res,next) => {
    
    var query = {_id: req.params.id}
    await User.deleteOne(query).exec()
    return res.status(200).json({ deleted: true})
}