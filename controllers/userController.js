'use_strict'

const mapBasicUser = require('./userAccountController').mapBasicUser
const User = require('../models/User')
const Sport = require('../models/Sport')

exports.getUsers = async (req, res, next) => {

  const limit = parseInt(req.query.limit)
  const fields = req.query.fields
  const sort = req.query.sort 

  const filter = {};
  const name = req.query.name;
  const alias = req.query.alias;
  if(name) { filter.name = { $regex: '^'+ name, $options: 'i' }}
  if(alias){ filter.alias = { $regex: '^'+ alias, $options: 'i' }}

  let users = await User.find(filter).select('-pass').limit(limit).sort(sort).exec()
  users = users.map(mapBasicUser)
  return res.status(200).json({result: users})
}

exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id).populate({
    path: 'interests',
    select: 'name image -_id',
    options: { limit: 10 }
  }) 
  return res.status(200).json({ result: user })
}

exports.deleteUser = async (req,res,next) => {
  var query = {_id: req.params.id}
  await User.deleteOne(query).exec()
  return res.status(200).json({ deleted: true})
}

exports.updateUser = async (req, res, next) => {
  const user = await User.findById(req.userId)
  const alias = req.query.alias
  let sports = req.query.sports
  if (sports) {
    sports = sports.split(',')
    sports = await Sport.find({slug :sports})
    user.interests = sports.map((sport) => {
      return sport._id
    })
  }
  if(alias) { user.alias = alias }
  await user.save()
  return res.status(200).json({success: true, message: 'User sports updated'})
}